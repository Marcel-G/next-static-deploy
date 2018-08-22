#!/bin/bash

# Test to make sure variables are defined
: "${npm_package_name:? npm_package_name environment variable not found. Run create-stack through npm.}"
: "${1:? domainName not set. create-stack <domainName> <environment>}"
: "${2:? environment not set. create-stack <domainName> <environment>}"

stackName="$npm_package_name-$2"
fullDomain="$2.$1"

read -p "Creating stack with the following details:
Stack name: $stackName
Domain: $fullDomain
Continue? (y/n)
" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if
        aws cloudformation create-stack \
            --stack-name $stackName \
            --capabilities CAPABILITY_NAMED_IAM \
            --template-body file://aws/resources-cloudformation.yml \
            --parameters \
                ParameterKey=RootDomainName,ParameterValue=$1 \
                ParameterKey=EnvironmentName,ParameterValue=$2 ;

    then 
        echo "Creating stack... (this can take several minutes)"
        aws cloudformation wait stack-create-complete --stack-name $stackName
        echo "Stack creation complete."
        sh ./aws/stack-info.sh $2
    else 
        echo "Could not create stack"
    fi
else 
    echo "Exiting..."
fi