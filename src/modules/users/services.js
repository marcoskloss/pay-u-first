export class TokenTypeError extends Error {
    constructor(message = 'Wrong token type') {
        super(message)
        this.custom = true
    }
}

export class EncodedError extends Error {
    constructor(message = 'Wrong credentials format') {
        super(message)
        this.custom = true
    }
}

export class BadCredentialsError extends Error {
    constructor(message) {
        super(message)
        this.custom = true
    }
}

export function decodeBasicToken(token) {
    const [type, credentials] = token.split(' ')

    if (type !== 'Basic') {
        throw new TokenTypeError()
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString()

    if (!decodedCredentials.includes(':')) {
        throw new EncodedError()
    }

    const [email, password] = decodedCredentials.split(':')

    if (!email) {
        throw new BadCredentialsError('Email is not provided')
    }

    if (!password) {
        throw new BadCredentialsError('Password is not provided')
    }

    return [email, password]
}
