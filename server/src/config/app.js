import express from 'express'
import jwt from 'express-jwt'
import jwksClient from 'jwks-rsa'


const app = express()

const jwtCheck = jwt({
	secret: jwksClient.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
	}),
	audience: process.env.AUTH0_AUDIENCE,
	issuer: process.env.AUTH0_ISSUER,
	algorithms: ["RS256"],
	credentialsRequired: false
});


/*
“You’ll notice that we’ve added some custom logic to this middleware to manage authorized access to the Express application. We must do this because by default express-jwt will throw an error if a token is invalid, even with credentialsRequired set to false. We don’t want Express to crash if the user submits an invalid token (for instance, if the token has exceeded its expiration time), so we must do some extra error handling here.”

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.” 
*/
app.use(jwtCheck, (err, req, res, next) => {
	if (err.code === 'invalid_token') {
		return next()
	}
	return next(err)
})

export default app