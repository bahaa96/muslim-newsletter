to run this local to test any small tweak run this: 
```
yarn go
```
Note: Still didn't make a file for local env variables.

to deploy it now run : 
```$xslt
now
```

to deploy it with now and remove the old instances:
```
yarn now
```

to set the environment variables to now: 

I use something called [now secrets](https://zeit.co/docs/getting-started/secrets)

Note: the code below only for the first deployment because it's account based doesn't change unless you change the account.
use it to set the three secrets

- airtable-api-token
- mailgun-api-key
- mailgun-domain
