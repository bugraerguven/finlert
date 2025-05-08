const { Spot } = require('@binance/connector');

const client = new Spot('', ''); // No API key needed for public endpoints

/**
 * Fetch latest closed candle for a given symbol and interval
 * @param {string} symbol - e.g. "BTCUSDT"
 * @param {string} interval - e.g. "15m", "1h", "1d"
 * @returns {Promise<object>} Latest closed candle data
 */
async function getLatestClosedCandle(symbol, interval) {
    try {
        // Get last 2 candles so that the first one is the *last closed* candle
        const { data } = await client.klines(symbol, interval, { limit: 2 });

        const candle = data[0]; // The latest *closed* candle

        return {
            symbol,
            interval,
            openTime: new Date(candle[0]),
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
            closeTime: new Date(candle[6]),
            checkDate: new Date(), // Time of retrieval
        };

    } catch (err) {
        console.error(`Error fetching candle for ${symbol} (${interval}):`, err.message);
        return null;
    }
}

