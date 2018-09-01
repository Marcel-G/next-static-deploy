#!/bin/bash

export ENV=$BITBUCKET_BRANCH

eval BRANCH=`echo $BITBUCKET_BRANCH | tr [a-z [A-Z]]`

eval export BUCKET_NAME=\$BUCKET_NAME_$BRANCH
eval export CLOUDFRONT_DISTRIBUTION_ID=\$CLOUDFRONT_DISTRIBUTION_ID_$BRANCH
eval export AWS_ACCESS_KEY_ID=\$AWS_ACCESS_KEY_ID_$BRANCH
eval export AWS_SECRET_ACCESS_KEY=\$AWS_SECRET_ACCESS_KEY_$BRANCH

echo "Branch: ${BITBUCKET_BRANCH}"

# Test to make sure variables are defined
: "${CLOUDFRONT_DISTRIBUTION_ID:? Variable not set. It should be set in bitbucket pipelines as CLOUDFRONT_DISTRIBUTION_ID_${BITBUCKET_BRANCH^^}}"
: "${BUCKET_NAME:? Variable not set. It should be set in bitbucket pipelines as BUCKET_NAME_${BITBUCKET_BRANCH^^}}"
: "${AWS_ACCESS_KEY_ID:? Variable not set. It should be set in bitbucket pipelines as AWS_ACCESS_KEY_ID_${BITBUCKET_BRANCH^^}}"
: "${AWS_SECRET_ACCESS_KEY:? Variable not set. It should be set in bitbucket pipelines as AWS_SECRET_ACCESS_KEY_${BITBUCKET_BRANCH^^}}"
