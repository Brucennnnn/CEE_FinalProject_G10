const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    PutCommand,
    DeleteCommand,
    ScanCommand,
    GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.addTask = async (req, res) => {
    const task_id = uuidv4();
    const created_date = new Date().toISOString();
    const task = { task_id: task_id, ...req.body, created_date: created_date };

    const params = {
        TableName: process.env.USER_TABLE_NAME,
        Item: task,
    }

    try {
        const data = await docClient.send(new PutCommand(params));
        console.log(data)
        res.send(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error adding item to DynamoDB',
            error: error,
        });
    }
};

exports.getTasks = async (req, res) => {
    const params = {
        TableName: "user_task",
        Key: {
            user_id: req.body.user_id,
        }
    };
    try {
        const data = await docClient.send(new GetCommand(params));
        res.send(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}
