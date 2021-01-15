const axios = require("axios").default;
const qs = require("qs");

const getManagementToken = async () =>
  await new Promise((resolve, reject) => {
    axios
      .request({
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_MTM_CLIENT_ID,
          client_secret: process.env.AUTH0_MTM_SECRET,
          audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        }),
      })
      .then((response) => resolve(response.data.access_token))
      .catch((error) => reject(error));
  });

const getUser = async ({ sub }) => {
  return await new Promise((resolve, reject) => {
    getManagementToken()
      .then((managementToken) => {
        axios({
          method: "GET",
          url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${sub}`,
          headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => reject(error));
      })
      .catch((err) => reject(err));
  });
};

const deleteUser = async ({ sub }) => {
  return await new Promise((resolve, reject) => {
    getManagementToken()
      .then((managementToken) => {
        axios({
          method: "DELETE",
          url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${sub}`,
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
        })
          .then((response) => resolve())
          .catch((error) => reject(error));
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  getUser,
  deleteUser,
};
