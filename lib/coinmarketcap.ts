"use server";

const CMC_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1";

export async function getTopCryptos(limit = 10) {
  try {
    const response = await fetch(`${CMC_API_URL}/cryptocurrency/listings/latest?limit=${limit}`, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY as string,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching top cryptos:", error);
    return [];
  }
}

export async function getCryptoDetails(id: string) {
  try {
    const response = await fetch(`${CMC_API_URL}/cryptocurrency/quotes/latest?id=${id}`, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY as string,
      },
    });
    const data = await response.json();
    return data.data?.[id] || null;
  } catch (error) {
    console.error("Error fetching crypto details:", error);
    return null;
  }
}

export async function getHistoricalData(id: string, timeRange: string) {
  const now = Math.floor(Date.now() / 1000);
  let startTime;
  
  switch (timeRange) {
    case "1M":
    case "1H":
      startTime = now - 60 * 60; // 1 hour ago
      break;
    case "1D":
      startTime = now - 24 * 60 * 60; // 1 day ago
      break;
    case "1W":
      startTime = now - 7 * 24 * 60 * 60; // 1 week ago
      break;
    default:
      startTime = now - 60 * 60; // Default to 1 hour
  }

  const interval = timeRange === "1M" || timeRange === "1H" ? "5m" : timeRange === "1D" ? "15m" : "1h";

  try {
    const response = await fetch(
      `${CMC_API_URL}/cryptocurrency/quotes/historical?id=${id}&time_start=${startTime}&time_end=${now}&interval=${interval}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY as string,
        },
      }
    );
    const data = await response.json();
    return data.data?.quotes || [];
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}
