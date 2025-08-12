const libFiles = require("@adobe/aio-lib-files");
const { Core } = require("@adobe/aio-sdk");

/**
 * Main action
 * @param {object} params Action input parameters
 * @returns {object} response
 */
async function main(params) {
  const files = await libFiles.init();
  const logger = Core.Logger("filemanager", { level: "info" });

  try {
    if (params.__ow_method === "get") {
      let content = "";

      if (params.path !== undefined && params.path !== "") {
        const properties = await files.getProperties(params.path);
        if (properties.isDirectory) {
          content = await files.list(params.path);
        } else {
          content = await files.read(params.path).toString();
        }
      } else {
        content = await files.list("/");
      }

      // Handle GET request
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      };
    } else if (params.__ow_method === "post") {
      // Handle POST request
      const { filePath, content } = params;

      if (!filePath || !content) {
        logger.error("Missing filePath or content in POST request");
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Missing filePath or content" }),
        };
      }

      try {
        // Write the content to the specified file
        await files.write(filePath, Buffer.from(content), {
          contentType: "text/plain",
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "File written successfully" }),
        };
      } catch (error) {
        logger.error("Error writing file:", error);
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Failed to write file" }),
        };
      }
    } else if (params.__ow_method === "delete") {
      // Handle DELETE request
      const { filePath } = params;

      if (!filePath) {
        logger.error("Missing filePath in DELETE request");
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Missing filePath" }),
        };
      }

      try {
        // Delete the specified file
        await files.delete(filePath);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "File deleted successfully" }),
        };
      } catch (error) {
        logger.error("Error deleting file:", error);
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Failed to delete file" }),
        };
      }
    } else if (params.__ow_method === "put") {
      // Handle PUT request
      const { filePath, content } = params;

      if (!filePath || !content) {
        logger.error("Missing filePath or content in PUT request");
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Missing filePath or content" }),
        };
      }

      try {
        // Write the content to the specified file
        await files.write(filePath, Buffer.from(content), {
          contentType: "text/plain",
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "File updated successfully" }),
        };
      } catch (error) {
        logger.error("Error updating file:", error);
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Failed to update file" }),
        };
      }
    } else {
      logger.error("Unsupported HTTP method:", params.__ow_method);
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    };
  }
}

exports.main = main;
