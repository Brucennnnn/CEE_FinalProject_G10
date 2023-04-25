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

exports.addTask = async (req, res) => {
    const task_id = uuidv4();
    const created_date = new Date().toISOString();
    const item = {user_id: req.user_id, task_id: task_id, ...req.body, created_date}
    const params = {
        TableName: process.env.aws_user_tasks_table_name,
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
};

exports.getTasks = async (req, res) => {
    var params = {
        TableName: process.env.aws_user_tasks_table_name,
        KeyConditionExpression: "user_id = :pk",
        ExpressionAttributeValues: {
            ":pk": req.user_id
            
        },
    };
    try {
        const data = await docClient.send(new QueryCommand(params));
        res.send(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}

exports.getTaskByTags = async (req, res) => {
    try {
        if (req.body.tag.length >= 1) {
            let tag = req.body.tag[0];
        var params = {
            TableName: process.env.aws_user_tasks_table_name,
            KeyConditionExpression: "user_id = :pk",
            FilterExpression: "contains(tags, :sk)",
            ExpressionAttributeValues: {
                ":pk": req.user_id,
                ":sk": tag
            },
        };
        const data = await docClient.send(new QueryCommand(params));
        data.Items.forEach(element => {
            req.body.tag.forEach(tag => {
                if (!element.tags.includes(tag)) {
                    data.Items.splice(data.Items.indexOf(element), 1)
                }
            })
        })
        res.send(data)
        } else {
            this.getTasks(req, res)
        }
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
        const params = {
            TableName: process.env.aws_user_tasks_table_name,
            Key: {
                user_id: req.user_id,
                task_id: req.body.task_id
            }
        };
        const data = await docClient.send(new DeleteCommand(params));
        res.send(data)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}


exports.updateTask = async (req, res) => {
    try {
        const params = {
            TableName: process.env.aws_user_tasks_table_name,
            Key: {
                user_id: req.user_id,
                task_id: req.body.task_id
            },
            UpdateExpression: "set task_name = :task_name, task_description = :task_description, task_status = :task_status",
            ExpressionAttributeValues: {
                ":task_name": req.body.task_name,
                ":task_description": req.body.task_description,
                ":task_status": req.body.task_status
            },
            ReturnValues: "UPDATED_NEW"
        };
        const data = await docClient.send(new UpdateCommand(params));
        res.send(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error getting item from DynamoDB',
            error: err,
        });
    }
}
