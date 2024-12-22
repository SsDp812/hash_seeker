import { createHmac } from 'crypto'

export class AuthHelper {
    public static isValid(
        telegramInitData: string,
        botToken: string,
        hash: string
    ): boolean {
        const result = this.parseInitData(telegramInitData)
        const initData = result.second
        const secretKey = this.createHmac('sha256', 'WebAppData', botToken)
        const initDataHash = this.hmacHex(secretKey, initData)
        return initDataHash === hash
    }

    private static parseInitData(
        telegramInitData: string
    ): Pair<string, string> {
        let initData = this.parseQueryString(telegramInitData)
        initData = this.sortMap(initData)
        const hash = initData.get('hash') || ''
        initData.delete('hash')

        const separatedData = Array.from(initData.entries())
            .map(([key, value]) => `${key}=${value}`)
            .join('\n')

        return new Pair(hash, separatedData)
    }

    private static parseQueryString(queryString: string): Map<string, string> {
        const parameters = new Map<string, string>()
        const pairs = queryString.split('\n')

        for (const pair of pairs) {
            const idx = pair.indexOf('=')
            const key =
                idx > 0 ? decodeURIComponent(pair.substring(0, idx)) : pair
            const value =
                idx > 0 && pair.length > idx + 1
                    ? decodeURIComponent(pair.substring(idx + 1))
                    : null
            if (value !== null) {
                parameters.set(key, value)
            }
        }

        return parameters
    }

    private static sortMap(map: Map<string, string>): Map<string, string> {
        return new Map([...map.entries()].sort())
    }

    private static createHmac(
        algorithm: string,
        key: string,
        data: string
    ): Buffer {
        return createHmac(algorithm, key).update(data).digest()
    }

    private static hmacHex(secretKey: Buffer, data: string): string {
        return createHmac('sha256', secretKey).update(data).digest('hex')
    }
}

export class Pair<F, S> {
    constructor(
        public first: F,
        public second: S
    ) {}

    public static of<F, S>(first: F, second: S): Pair<F, S> {
        return new Pair(first, second)
    }
}
