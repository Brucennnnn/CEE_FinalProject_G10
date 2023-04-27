const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    PutCommand,
    DeleteCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.addTag = async (req, res) => {
    const tag_id = uuidv4();
    const created_date = new Date().toISOString();
    const item = {user_id: req.user_id, tag_id: tag_id, ...req.body, created_date}
    const params = {
        TableName: process.env.aws_user_tags_table_name,
        Item: item 
    };
    try {
      const data = await docClient.send(new PutCommand(params));
      res.send(data)  
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error adding item to DynamoDB',
            error: error,
        });
    }
}

exports.getTags = async (req, res) => {
    const params = {
        TableName: process.env.aws_user_tags_table_name,
        KeyConditionExpression: "user_id = :pk",
        ExpressionAttributeValues: {
            ":pk": req.user_id
        },
    };
    try {
        const data = await docClient.send(new QueryCommand(params));
        res.send(data.Items)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}

exports.deleteTag = async (req, res) => {
    const params = {
        TableName: process.env.aws_user_tags_table_name,
        Key: {
            user_id: req.user_id,
            tag_id: req.body.tag_id
        }
    }
    try {
        const data = await docClient.send(new DeleteCommand(params));
        res.send(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting item from DynamoDB',
            error: err,
        });
    }
}