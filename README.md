# Next Static Deploy

This project shows a solution for hosting, deploying static next.js exports and allowing content updates post deployment using serverless. It's focus is to make deployments and creation of new environments as easy as possible.

## Why host static files?

Hosting a website with only static files has many advantages. Its scaleable, cheap to run, and has just about no moving parts in production making it easy maintain. It may not be appropriate for all websites of course, but for the case where all users are served the same content it's great. 

The use case for this solution is a website where content is regularly being edited via a CMS ([Contentful](https://www.contentful.com) in this case) and deployments happen often.

To allow for frequent content updates, rather than rebuilding the entire codebase from source and redeploying; this solution executes only next.js export in a serverless function. It's not necessary to rebuild the next.js bundles since no code changes have been made. This means content changes can be made very rapidly and frequently.

The stack consists of an AWS S3 bucket and CloudFront distribution. Included in the repo is a CloudFormation template for creating this stack with ease. This makes it trivial to create new environments as the need arises.

Deploying code changes is done with bitbucket pipelines. The pipeline will build next.js project, deploy the serverless function to handle content changes as well as populate the S3 bucket with the initial next.js export. The pipeline is setup by default to run whenever changes are pushed to `production` or `staging` branches.

# How to use

## Prerequisite
  - Install [Serverless](https://serverless.com/framework/docs/providers/aws/guide/installation)
  - Configure [AWS CLI](https://aws.amazon.com/cli) (Should already be done from following Serverless install guide)
  - Push this code to a new [Bitbucket](https://bitbucket.org) repo and enable [Pipelines Feature](https://bitbucket.org/product/features/pipelines)
  - Create a new [Contentful](https://www.contentful.com) space
  - Install [contentful-cli](https://github.com/contentful/contentful-cli)

## Configuration
1. Change the package name in `package.json` this will be used to name the stack in AWS.
2. Create a Contentful [access token](https://www.contentful.com/developers/docs/references/authentication/). Save Contentful token details in `.env` (reference `.env.example`)

## Import example space into Contentful
Import example space content from this repo into your new space using contentful-cli:
```
contentful login
contentful space import \
  --content-file contenful-space.example.json \
  --space-id <space-id>
```

## Run locally
Test the project on your local machine:
```
npm install
npm run dev
```

## Create an environment
Create a `production` environment in AWS:
```
git submodule update --init --recursive // install submodules
npm run aws:create-stack <domain name> production
```
When the stack has finished being created, get the stack information:
```
npm run aws:stack-info production

=>  {
        "OutputKey": "CloudfrontDistributionId",
        "OutputValue": "xxx",
        "Description": "CLOUDFRONT_DISTRIBUTION_ID to use in bitbucket pipeline."
    },
    {
        "OutputKey": "BucketName",
        "OutputValue": "xxx",
        "Description": "BUCKET_NAME to use in bitbucket pipeline."
    },
    {
        "OutputKey": "DeploymentAccessKeyId",
        "OutputValue": "xxx",
        "Description": "AWS_ACCESS_KEY_ID to use in bitbucket pipeline."
    },
    {
        "OutputKey": "CloudfrontDomainName",
        "OutputValue": "xxx.cloudfront.net",
        "Description": "Live url to preview site."
    },
    {
        "OutputKey": "DeploymentSecretAccessKey",
        "OutputValue": "xxx",
        "Description": "AWS_SECRET_ACCESS_KEY to use in bitbucket pipeline."
    }
```

## Configure pipeline for new environment
Add the following [environment variables](https://confluence.atlassian.com/bitbucket/environment-variables-794502608.html#Environmentvariables-User-definedvariables) to your bitbuket pipeline config:

(Environment specific variables should be defined with the environment name following)
```
CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION=xxx
BUCKET_NAME_PRODUCTION=xxx
AWS_ACCESS_KEY_ID_PRODUCTION=xxx
AWS_SECRET_ACCESS_KEY_PRODUCTION=xxx
```

(Contentful variables are the same for all environments)
```
CONTENTFUL_ACCESS_TOKEN=xxx
CONTENTFUL_ACCESS_SPACE=xxx
```

## Push new code
By creating a `production` branch and pushing a change to it, the pipeline will trigger and deploy the site.
```
  git checkout -b production
  git add .
  git commit -am "push to production"
  git push origin production
```

## Contentful webhook
The final step is to setup Contentful to update the site whenever content is changed in the cms.
After the first pipeline has run, the serverless endpoint should display when getting stack info:
```
npm run aws:stack-info production
=> https://xxx.execute-api.ap-southeast-2.amazonaws.com/production
```
Setup a [Contenful webhook](https://www.contentful.com/developers/docs/concepts/webhooks#create-and-configure-a-webhook) to fire whenever an entry is published or unpublished.
The url should be the `<endpoint>/exportAll` with `POST` method.

It is a good idea to [setup an API key](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-setup-api-key-with-console.html) in api gateway for Contentful to secure the endpoint. Add they key as `x-api-key` header in the webhook config.

# Technology
  - [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines)
  - [Serverless](https://serverless.com)
  - [Contentful](https://www.contentful.com)
  - [next.js](https://github.com/zeit/next.js)
