const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

const axios = require("axios");
exports.authApp = (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      const tokenRes = await axios.post(access_token_url, postData, tokenOptions);
      const token = tokenRes.data;
      res.set("Authorization", `Bearer ${token.access_token}`)
      req.session.token = token;
      console.log(req.session);
      if (token) {
        res.writeHead(302, {
          Location: `http://${process.env.frontendIPAddress}/index.html`,
        });
        res.send(getUserID(req));
        res.end();
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

exports.returnSession = async (req, res) => {
  res.send(req.session.token)
  res.end()
}


exports.getCourse = async (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    axios.get("https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1", profileOptions).then(profileRes =>
      profileRes.data.data.student).then(courses => {
        let all_courses = courses.filter(e => e.semester == req.params.semester).filter(e => e.year == req.params.year).map(e => {
          return { cv_cid: e.cv_cid, title: e.title }
        })
        res.send(all_courses)
        res.end()
        return
      })
  } catch (err) {
    console.log(err);
  }
};


exports.getSemesterAndYear = async (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    let sem = 0;
    let year = 0;
    axios.get("https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1", profileOptions)
      .then(profileRes => profileRes.data.data.student)
      .then(courses => {
        courses.map(e => {
          if (e.year > year) {
            year = e.year
            sem = e.semester
          }
          else if (e.year == year && e.semester > sem) {
            sem = e.semester

          }
        })
        res.send({ sem: sem, year: year })
        res.end()
        return
      })
  } catch (err) {
    console.log(err);
  }
};




exports.getAssignments = async (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    axios.get(`https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${req.params.id}&detail=1`, profileOptions).then(profileRes => {
      res.send(profileRes.data)
      res.end()
      return
    })
  } catch (error) {
    console.log(error)
  }
}


exports.getUserInfo = async (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    axios.get("https://www.mycourseville.com/api/v1/public/get/user/info", profileOptions).then(profileRes => {
      res.send(profileRes.data.data);
      res.end();
    }).catch((err) => {
      res.status(401).send(err);
      console.log(err);
    })
  } catch (err) {
    res.status(401).send(err)
    console.log(err);
  }
};


exports.getAllAssignments = async (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    await axios.get("https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1", profileOptions).then(profileRes =>
      profileRes.data.data.student).then(courses => {
        let all_courses = courses.filter(e => e.semester == req.params.semester).filter(e => e.year == req.params.year).map(e => {
          return { cv_cid: e.cv_cid, title: e.title, icon: e.course_icon }
        })
        return all_courses
      }
      ).then(
        all_courses => {
          arr = []
          // console.log(all_courses);
          // Promise.all(all_courses.map(element => {
          //   findAllAssignmentbyID(req, element.cv_cid).then(e => e.forEach(k => k.forEach(s => (arr.push({course_title: element.title, item_id: s.itemid, title: s.title, created: s.created, duetime: s.duetime }))))).then(() => res.send(arr)).then(() => res.end())
          // }))
          return passer(all_courses, req).then(e => e.forEach(k => k.forEach(s => (arr.push({ item_id: s.itemid, title: s.title, cv_cid: s.cv_cid, course_title: s.course_title, icon: s.icon, created: s.created, duetime: s.duetime, instruction: s.instruction }))))).then(() => res.send(arr)).then(() => res.end())
        }).catch(error => {
          console.log(error)
        });
  } catch (err) {
    console.log(err);
  }
};

async function passer(courseid, req) {
  try {
    const re = await Promise.all(courseid.map(element => {
      return findAllAssignmentbyID(req, element)
    }))
    return re
  }
  catch (error) {
    console.log(error)
  }
}

function findAllAssignmentbyID(req, element) {
  return new Promise((resolve, reject) => {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    axios
      .get(
        `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${element.cv_cid}&detail=1`,
        profileOptions
      )
      .then((profileRes) => {
        const profile = profileRes.data;
        if (profile.data != []) {
          profile.data.forEach((e) => {
            Object.assign(e, { course_title: element.title })
            Object.assign(e, { cv_cid: element.cv_cid })
            Object.assign(e, { icon: element.icon })
          });
          const now = new Date();
          profile.data = profile.data.filter(e => e.duetime > now.getTime() / 1000)
          resolve(profile.data);
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

const getUserID = (req) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = axios.get("https://www.mycourseville.com/api/v1/public/users/me", profileOptions)
    profileReq.then((profileRes) => {
      return profileRes.data.user.id;
    }).catch((err) => {
      console.log(err);
    })
  } catch (err) {
    console.log(err);
  }
};


exports.logout = (req, res) => {
  try {
    req.session.destroy();
    res.redirect(`http://${process.env.frontendIPAddress}/index.html`);
    res.end();
  } catch (err) {
    console.log(err);
  }
}


