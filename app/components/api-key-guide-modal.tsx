import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApiKeyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: string;
  guideSteps: string[];
}

export function ApiKeyGuideModal({
  isOpen,
  onClose,
  exchange,
  guideSteps,
}: ApiKeyGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{exchange} API 키 발급 가이드</DialogTitle>
          <DialogDescription className="text-gray-400">
            {exchange} API 키를 받으려면 다음 단계를 따르세요:
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc list-inside space-y-2">
          {guideSteps.map((step, index) => (
            <li
              key={index}
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: step }}
            />
          ))}
        </ul>
        <p className="text-sm text-gray-100 mt-4 underline">
          ※ API 키를 안전하게 보관하고 다른 사람과 공유하지 마세요. ※
          <br /> ※ 거래 정보만 조회하도록 설정해주세요. ※
          <br /> ※ 입금, 주문, 출금을 선택하여 생긴 피해는 책임지지 않습니다. ※
        </p>
      </DialogContent>
    </Dialog>
  );
}
