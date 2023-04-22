const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    PutCommand,
    DeleteCommand,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.addTask = async (req, res) => {
    const task_id = uuidv4();
    const task = { task_id: item_id, ...req.body, created_date: created_date };

    // You should change the response below.
    const params = {
        TableName: process.env.aws_items_table_name,
        Item: item,
    }

    try {
        // Use the DocumentClient.put method to add a new item to the table
        const data = docClient.send(new PutCommand(params));
        res.send()
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error adding item to DynamoDB',
            error: error,
        });
    }
};