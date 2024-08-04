const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// const client = new DynamoDBClient({
//     region: process.env.REGION_DYNAMODB,
//     endpoint: process.env.URL_DYNAMODB
// });
const client = new DynamoDBClient({
    region: process.env.REGION_DYNAMODB,
    // endpoint: process.env.URL_DYNAMODB
});

const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = {
    dynamoDB,
    table_users: 'user',
    table_route: 'route',
    table_travel: 'travel',
    table_payment: 'payment',
    table_transport: 'transport',
    table_black_list: 'blackList',
    aws_region_config: {
        region: process.env.REGION_DYNAMODB,
        endpoint: process.env.URL_DYNAMODB
    },
    aws_remote_congif: {
    }
}