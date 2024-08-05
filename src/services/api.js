import axios from "axios";

export default {
  async getGeneratedMaze(difficulty) {
    let config = {
      method: "get",
      url: `http://127.0.0.1:8000/api/generateMaze/${difficulty}`,
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
      url: `http://127.0.0.1:8000/api/solution/${solutionType}`,
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
};
