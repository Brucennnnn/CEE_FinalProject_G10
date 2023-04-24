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
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.addTask = async (req, res) => {

    let newMember;
    const task_id = uuidv4();
    const created_date = new Date().toISOString();
    try {
        const getparams = {
            TableName: "user_task",
            Key: {
                user_id: req.user_id,
            }
        };
        const data = await docClient.send(new GetCommand(getparams));
        const newbody = { task_id: task_id, ...req.body, created_date: created_date }
        newMember = [...data.Item.Task, newbody]
    } catch (error) {

        const createparams = {
            TableName: "user_task",
            Item: { user_id: req.user_id, Task: [{ task_id: task_id, ...req.body, created_date: created_date }] }
        }
        const createdata = await docClient.send(new PutCommand(createparams))
        res.send(createdata)
        return
    }

    try {
        const params = {
            TableName: "user_task",
            Key: {
                user_id: req.user_id
            },
            ExpressionAttributeNames: {
                "#task": "Task"
            },
            UpdateExpression: `SET #task = :p`,
            ExpressionAttributeValues: {
                ":p": newMember
            },
        }
        const newdata = await docClient.send(new UpdateCommand(params));
        res.send(newdata)
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
            user_id: req.user_id,
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





exports.deleteTask = async (req, res) => {
    
    
    try {
        const getparams = {
            TableName: "user_task",
            Key: {
                user_id: req.user_id,
            }
        };
        const data = await docClient.send(new GetCommand(getparams));
        const newmember = data.Item.Task.filter((item) => item.task_id !== req.body.task_id)
        const params = {
            TableName: "user_task",
            Key: {
                user_id: req.user_id
            },
            ExpressionAttributeNames: {
                "#task": "Task"
            },
            UpdateExpression: `SET #task = :p`,
            ExpressionAttributeValues: {
                ":p": newmember
            },
        }
        const newdata = await docClient.send(new UpdateCommand(params));

        res.send(newdata)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}
