
: "${1:? environment not set. stack-info <environment>}"

projectName=$2

if [ -z "$2" ]
then
    projectName=$npm_package_name
else
    projectName=$2
fi

: "${projectName:? stackName not provided. Run create-stack through npm or provide stackName as second arg.}"


echo "This is the endpoint for contentful webhook: ([endpoint]/exportAll)"
aws cloudformation describe-stacks \
    --stack-name "$projectName-deploy-$1" \
    --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue' \
    --output text;