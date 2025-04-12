// 导入所需的模块
import { ai, z } from "./genkit.js"; // 导入 Genkit AI 库和 Zod 验证库
import { callTmdbApi } from "./tmdb.js"; // 导入用于调用 TMDB API 的函数

// 定义一个名为 searchMovies 的 Genkit 工具
export const searchMovies = ai.defineTool(
  {
    name: "searchMovies", // 工具的名称
    description: "search TMDB for movies by title", // 工具的描述，说明其功能
    // 定义工具的输入模式，使用 Zod 定义一个包含 query 字符串的对象
    inputSchema: z.object({
      query: z.string(), // query 字段必须是字符串类型
    }),
  },
  // 工具的异步执行函数，接收包含 query 的对象作为参数
  async ({ query }) => {
    // 在控制台打印日志，显示正在搜索电影以及搜索查询
    console.log("[tmdb:searchMovies]", JSON.stringify(query));
    try {
      // 调用 TMDB API 搜索电影，传入类型 "movie" 和搜索查询 query
      const data = await callTmdbApi("movie", query);

      // 处理 API 返回的结果
      // 遍历搜索结果数组 data.results
      const results = data.results.map((movie: any) => {
        // 检查电影对象是否有 poster_path 属性
        if (movie.poster_path) {
          // 如果有，将其转换为完整的 URL
          movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        }
        // 检查电影对象是否有 backdrop_path 属性
        if (movie.backdrop_path) {
          // 如果有，将其转换为完整的 URL
          movie.backdrop_path = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
        }
        // 返回修改后的电影对象
        return movie;
      });

      // 返回包含完整图像 URL 的处理后数据
      return {
        ...data, // 保留原始数据的其他字段
        results, // 使用处理后的 results 数组
      };
    } catch (error) {
      // 如果在调用 API 或处理数据时发生错误
      // 在控制台打印错误信息
      console.error("Error searching movies:", error);
      // 重新抛出错误，以便 Genkit 或调用者可以适当地处理它
      throw error;
    }
  }
);

// 定义一个名为 searchPeople 的 Genkit 工具
export const searchPeople = ai.defineTool(
  {
    name: "searchPeople", // 工具的名称
    description: "search TMDB for people by name", // 工具的描述，说明其功能
    // 定义工具的输入模式，使用 Zod 定义一个包含 query 字符串的对象
    inputSchema: z.object({
      query: z.string(), // query 字段必须是字符串类型
    }),
  },
  // 工具的异步执行函数，接收包含 query 的对象作为参数
  async ({ query }) => {
    // 在控制台打印日志，显示正在搜索人物以及搜索查询
    console.log("[tmdb:searchPeople]", JSON.stringify(query));
    try {
      // 调用 TMDB API 搜索人物，传入类型 "person" 和搜索查询 query
      const data = await callTmdbApi("person", query);

      // 处理 API 返回的结果
      // 遍历搜索结果数组 data.results
      const results = data.results.map((person: any) => {
        // 检查人物对象是否有 profile_path 属性
        if (person.profile_path) {
          // 如果有，将其转换为完整的 URL
          person.profile_path = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        }

        // 检查人物对象是否有 known_for 属性，并且它是一个数组
        if (person.known_for && Array.isArray(person.known_for)) {
          // 遍历 known_for 数组中的作品
          person.known_for = person.known_for.map((work: any) => {
            // 检查作品对象是否有 poster_path 属性
            if (work.poster_path) {
              // 如果有，将其转换为完整的 URL
              work.poster_path = `https://image.tmdb.org/t/p/w500${work.poster_path}`;
            }
            // 检查作品对象是否有 backdrop_path 属性
            if (work.backdrop_path) {
              // 如果有，将其转换为完整的 URL
              work.backdrop_path = `https://image.tmdb.org/t/p/w500${work.backdrop_path}`;
            }
            // 返回修改后的作品对象
            return work;
          });
        }

        // 返回修改后的人物对象
        return person;
      });

      // 返回包含完整图像 URL 的处理后数据
      return {
        ...data, // 保留原始数据的其他字段
        results, // 使用处理后的 results 数组
      };
    } catch (error) {
      // 如果在调用 API 或处理数据时发生错误
      // 在控制台打印错误信息
      console.error("Error searching people:", error);
      // 重新抛出错误，以便 Genkit 或调用者可以适当地处理它
      throw error;
    }
  }
);
