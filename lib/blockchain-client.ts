import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

// 환경 변수에서 API 키 가져오기
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 초기화
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 이더리움 프로바이더 초기화
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
);

// 트랜잭션 타입 정의
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
  status: boolean;
  input: string;
  tokenTransfers?: TokenTransfer[];
}

// 토큰 전송 타입 정의
export interface TokenTransfer {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  from: string;
  to: string;
  value: string;
}

// 블록체인 클라이언트 클래스
export class BlockchainClient {
  // 지갑 주소의 트랜잭션 가져오기
  async getTransactions(address: string, limit: number = 100): Promise<Transaction[]> {
    try {
      // Etherscan API를 통해 트랜잭션 가져오기
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || '트랜잭션을 가져오는데 실패했습니다');
      }
      
      // 트랜잭션 데이터 변환
      const transactions: Transaction[] = data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatEther(tx.value),
        timestamp: parseInt(tx.timeStamp) * 1000, // 밀리초로 변환
        blockNumber: parseInt(tx.blockNumber),
        gasUsed: tx.gasUsed,
        gasPrice: ethers.utils.formatUnits(tx.gasPrice, 'gwei'),
        status: tx.isError === '0',
        input: tx.input,
      }));
      
      // 토큰 전송 정보 가져오기
      const tokenTransfers = await this.getTokenTransfers(address, limit);
      
      // 트랜잭션과 토큰 전송 정보 병합
      for (const tx of transactions) {
        tx.tokenTransfers = tokenTransfers.filter(
          (transfer) => transfer.from === tx.from || transfer.to === tx.to
        );
      }
      
      return transactions;
    } catch (error) {
      console.error('트랜잭션 가져오기 실패:', error);
      throw error;
    }
  }
  
  // 토큰 전송 정보 가져오기
  async getTokenTransfers(address: string, limit: number = 100): Promise<TokenTransfer[]> {
    try {
      // Etherscan API를 통해 토큰 전송 정보 가져오기
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || '토큰 전송 정보를 가져오는데 실패했습니다');
      }
      
      // 토큰 전송 정보 변환
      const tokenTransfers: TokenTransfer[] = data.result.map((tx: any) => ({
        tokenAddress: tx.contractAddress,
        tokenName: '', // 추가 정보 필요
        tokenSymbol: tx.tokenSymbol,
        tokenDecimals: parseInt(tx.tokenDecimal),
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatUnits(tx.value, parseInt(tx.tokenDecimal)),
      }));
      
      // 토큰 이름 가져오기 (필요한 경우)
      for (const transfer of tokenTransfers) {
        try {
          const tokenContract = new ethers.Contract(
            transfer.tokenAddress,
            ['function name() view returns (string)'],
            provider
          );
          
          transfer.tokenName = await tokenContract.name();
        } catch (error) {
          console.error(`토큰 이름 가져오기 실패 (${transfer.tokenAddress}):`, error);
        }
      }
      
      return tokenTransfers;
    } catch (error) {
      console.error('토큰 전송 정보 가져오기 실패:', error);
      throw error;
    }
  }
  
  // 지갑 잔액 가져오기
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('잔액 가져오기 실패:', error);
      throw error;
    }
  }
  
  // 토큰 잔액 가져오기
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)',
          'function symbol() view returns (string)',
        ],
        provider
      );
      
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ]);
      
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error('토큰 잔액 가져오기 실패:', error);
      throw error;
    }
  }
  
  // 트랜잭션 데이터 저장
  async saveTransactions(userId: string, transactions: Transaction[]): Promise<void> {
    try {
      // 트랜잭션 데이터 저장
      const { error } = await supabase
        .from('Transactions')
        .upsert(
          transactions.map((tx) => ({
            user_id: userId,
            hash: tx.hash,
            from_address: tx.from,
            to_address: tx.to,
            value: tx.value,
            timestamp: new Date(tx.timestamp).toISOString(),
            block_number: tx.blockNumber,
            gas_used: tx.gasUsed,
            gas_price: tx.gasPrice,
            status: tx.status,
            input: tx.input,
          }))
        );
      
      if (error) throw error;
      
      // 토큰 전송 데이터 저장
      const tokenTransfers = transactions
        .filter((tx) => tx.tokenTransfers && tx.tokenTransfers.length > 0)
        .flatMap((tx) =>
          tx.tokenTransfers!.map((transfer) => ({
            user_id: userId,
            transaction_hash: tx.hash,
            token_address: transfer.tokenAddress,
            token_name: transfer.tokenName,
            token_symbol: transfer.tokenSymbol,
            token_decimals: transfer.tokenDecimals,
            from_address: transfer.from,
            to_address: transfer.to,
            value: transfer.value,
          }))
        );
      
      if (tokenTransfers.length > 0) {
        const { error: tokenError } = await supabase
          .from('TokenTransfers')
          .upsert(tokenTransfers);
        
        if (tokenError) throw tokenError;
      }
    } catch (error) {
      console.error('트랜잭션 데이터 저장 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const blockchainClient = new BlockchainClient(); 