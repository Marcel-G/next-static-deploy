#!/bin/bash

export BRANCH=$BITBUCKET_BRANCH

case $BITBUCKET_BRANCH in
  "production")
    export ENV="production"
    export BUCKET_NAME=$BUCKET_NAME_PRODUCTION
    export CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION
    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PRODUCTION
    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PRODUCTION
    ;;
  "staging")
    export ENV="production"
    export BUCKET_NAME=$BUCKET_NAME_STAGING
    export CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID_STAGING
    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_STAGING
    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_STAGING
    ;;
  *)
    echo "Unknown branch for deployment $BITBUCKET_BRANCH"
    exit 1
    ;;
esac

# Test to make sure variables are defined
: "${CLOUDFRONT_DISTRIBUTION_ID:? Variable not set. It should be set in bitbucket pipelines as CLOUDFRONT_DISTRIBUTION_ID_${BITBUCKET_BRANCH^^}}"
: "${BUCKET_NAME:? Variable not set. It should be set in bitbucket pipelines as BUCKET_NAME_${BITBUCKET_BRANCH^^}}"
: "${AWS_ACCESS_KEY_ID:? Variable not set. It should be set in bitbucket pipelines as AWS_ACCESS_KEY_ID_${BITBUCKET_BRANCH^^}}"
: "${AWS_SECRET_ACCESS_KEY:? Variable not set. It should be set in bitbucket pipelines as AWS_SECRET_ACCESS_KEY_${BITBUCKET_BRANCH^^}}"

echo "Branch: ${BITBUCKET_BRANCH}"