import {
    decodeBasicToken,
    BadCredentialsError,
    TokenTypeError,
    EncodedError,
} from './services'

describe('User module', () => {
    it('should return credentials by basic authentication token', () => {
        const email = 'myemail@mail.com'
        const password = 'my-secret-pass'
        const token = Buffer.from(`${email}:${password}`).toString('base64')

        const basicToken = `Basic ${token}`

        const result = decodeBasicToken(basicToken)
        expect(result).toEqual([email, password])
    })

    it('should throw new error when token is not Basic type', () => {
        const email = 'myemail@mail.com'
        const password = 'my-secret-pass'
        const token = Buffer.from(`${email}:${password}`).toString('base64')

        const basicToken = `Bearer ${token}`

        const result = () => decodeBasicToken(basicToken)
        expect(result).toThrowError(TokenTypeError)
    })

    it('should throw new error when token is in wrong format', () => {
        const email = 'myemail@mail.com'
        const password = 'my-secret-pass'
        const token = Buffer.from(`${email}${password}`).toString('base64')

        const basicToken = `Basic ${token}`

        const result = () => decodeBasicToken(basicToken)
        expect(result).toThrowError(EncodedError)
    })

    it('should throw new error when password is not provided', () => {
        const email = 'myemail@mail.com'
        const token = Buffer.from(`${email}:`).toString('base64')

        const basicToken = `Basic ${token}`

        const result = () => decodeBasicToken(basicToken)
        expect(result).toThrowError(BadCredentialsError)
    })

    it('should throw new error when password is not provided', () => {
        const password = 'my-secret-pass'
        const token = Buffer.from(`:${password}`).toString('base64')

        const basicToken = `Basic ${token}`

        const result = () => decodeBasicToken(basicToken)
        expect(result).toThrowError(BadCredentialsError)
    })
})
