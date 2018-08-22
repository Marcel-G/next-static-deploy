
: "${npm_package_name:? npm_package_name environment variable not found. Run create-stack through npm.}"
: "${1:? environment not set. stack-info <environment>}"

echo "Add these variables to bitbucket pipelines followed by the environment. Eg. BUCKET_NAME_PRODUCTION:"
aws cloudformation describe-stacks \
    --stack-name "$npm_package_name-$1" \
    --query 'Stacks[0].Outputs' \
    --output json;

echo "This is the endpoint for contentful webhook: ([endpoint]/exportAll)"
aws cloudformation describe-stacks \
    --stack-name "$npm_package_name-deploy-$1" \
    --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue' \
    --output text;