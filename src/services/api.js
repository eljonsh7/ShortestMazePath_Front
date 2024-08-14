import axios from "axios";
let apiUrl = process.env.VUE_APP_API_URL;

export default {
  async getGeneratedMaze(difficulty) {
    let config = {
      method: "get",
      url: `${apiUrl}/generateMaze/${difficulty}`,
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getGeneratedMaze ~ error:", error);
      return false;
    }
  },
  async getSolution(solutionType, maze) {
    let config = {
      method: "post",
      url: `${apiUrl}/solution/${solutionType}`,
      data: { data: maze },
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getSolution ~ error:", error);
      return false;
    }
  },
  async storeMaze(difficulty) {
    let config = {
      method: "post",
      url: `${apiUrl}/multiplayer/storeMaze/${difficulty}`,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getSolution ~ error:", error);
      return false;
    }
  },
  async getMultiplayerMaze(mazeId, data) {
    let config = {
      method: "post",
      url: `${apiUrl}/multiplayer/getMaze/${mazeId}`,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      data
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getSolution ~ error:", error);
      return false;
    }
  },
  async beReady(mazeId, data) {
    let config = {
      method: "post",
      url: `${apiUrl}/multiplayer/beReady/${mazeId}`,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      data
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getSolution ~ error:", error);
      return false;
    }
  },
  async finishMaze(mazeId, data) {
    let config = {
      method: "post",
      url: `${apiUrl}/multiplayer/finishMaze/${mazeId}`,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      data
    };

    try {
      return await axios.request(config);
    } catch (error) {
      console.log("🚀 ~ getSolution ~ error:", error);
      return false;
    }
  },
};
