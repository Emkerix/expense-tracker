const express = require("express");
const cors = require("cors");
const app = express();
module.exports = { app };
const _PORT_ = 8000;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

app.use(cors());
app.use(express.json());

const db = require("./db.js");
const { _API_URL_ } = require("./utils/globals.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "Express Library API",
    },
    servers: [
      {
        url: _API_URL_,
      },
    ],
  },
  apis: ["./index.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/* TRANSACTIONS */
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API endpoints related to transactions
 */

/* PROFILES */
/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: API endpoints related to profiles
 */

/* CATEGORIES */
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints related to categories
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     description: Returns all transactions
 *     responses:
 *       200:
 *         description: A list of transactions
 */
app.get("/transactions", (request, response) => {
  const query = `SELECT t.*, cat.NAME as CATEGORY_NAME
  FROM 'TRANSACTION' AS t
  LEFT JOIN 'CATEGORY' AS 'cat' ON t.ID_CATEGORY=cat.ID_CATEGORY
  ;`;
  db.all(query, [], (error, rows) => {
    if (error) {
      response.status(404).json({ err: error.message });
    }
    rows.forEach((row) => {
      console.log(row);
    });
    response.json({ rows });
  });
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get a transaction by ID
 *     description: Returns a single transaction based on its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single transaction
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
app.get("/transactions/:id", (request, response) => {
  const id = request.params.id;
  const query = `SELECT TITLE, ID_CATEGORY, DATE, AMOUNT, DESCRIPTION FROM 'TRANSACTION' WHERE ID_TRANSACTION = ?
  ;`;
  db.get(query, [id], (error, row) => {
    if (error) {
      response.status(500).json({ error: error.message });
      return;
    }
    if (!row) {
      response.status(404).json({ error: "Transaction not found" });
      return;
    }
    response.json(row);
  });
});

/**
 * @swagger
 * /profiles/{id}/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transactions for a profile
 *     description: Retrieve transactions associated with a specific profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the profile to retrieve transactions for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success - transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID_TRANSACTION:
 *                         type: integer
 *                       ID_CATEGORY:
 *                         type: integer
 *                       ID_PROFILE:
 *                         type: integer
 *                       TITLE:
 *                         type: string
 *                       DATE:
 *                         type: string
 *                         format: date
 *                       AMOUNT:
 *                         type: number
 *                       DESCRIPTION:
 *                         type: string
 *                       CATEGORY_NAME:
 *                         type: string
 *       404:
 *         description: Not found - no transactions found for this profile
 *       500:
 *         description: Internal server error
 */
app.get("/profiles/:id/transactions", (request, response) => {
  const profileId = request.params.id;
  const profileQuery = `
    SELECT ID_PROFILE
    FROM 'PROFILE'
    WHERE ID_PROFILE = ?;
  `;
  db.get(profileQuery, [profileId], (profileError, profileRow) => {
    if (profileError) {
      response.status(500).json({ err: profileError.message });
    } else if (!profileRow) {
      response.status(404).json({ message: "Profile not found" });
    } else {
      const transactionsQuery = `
        SELECT t.*, cat.NAME as CATEGORY_NAME
        FROM 'TRANSACTION' AS t
        LEFT JOIN 'CATEGORY' AS 'cat' ON t.ID_CATEGORY=cat.ID_CATEGORY
        WHERE t.ID_PROFILE = ?;
      `;
      db.all(transactionsQuery, [profileId], (error, rows) => {
        if (error) {
          response.status(500).json({ err: error.message });
        } else {
          response.json({ transactions: rows });
        }
      });
    }
  });
});

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete a transaction by ID
 *     description: Deletes a transaction based on its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
app.delete("/transactions/:id", (request, response) => {
  db.run(
    `DELETE FROM 'TRANSACTION' WHERE ID_TRANSACTION=?`,
    [request.params.id],
    (error) => {
      if (error) {
        response.status(404).json({ err: error.message });
      } else {
        response.status(204).json({ message: "deleted" });
      }
    }
  );
});

/**
 * @swagger
 * /profiles/{id}/transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction for a profile
 *     description: Creates a new transaction associated with a specific profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the profile to create the transaction for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_CATEGORY:
 *                 type: integer
 *               TITLE:
 *                 type: string
 *               DATE:
 *                 type: string
 *                 format: date
 *               AMOUNT:
 *                 type: number
 *                 minimum: 0.01
 *               DESCRIPTION:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Bad request - invalid input data
 *       422:
 *         description: Unprocessable Entity
 *       500:
 *         description: Internal server error
 */
app.post("/profiles/:id/transactions", (request, response) => {
  const { ID_CATEGORY, TITLE, DATE, AMOUNT, DESCRIPTION } = request.body;
  const ID_PROFILE = request.params.id;

  if (AMOUNT <= 0) {
    response.status(422).json({ error: "AMOUNT must be greater than 0" });
    return;
  }

  db.get(
    `SELECT 1 FROM 'CATEGORY' WHERE ID_CATEGORY = ?`,
    [ID_CATEGORY],
    (categoryError, categoryResult) => {
      if (categoryError || !categoryResult) {
        response
          .status(422)
          .json({ error: "ID_CATEGORY not found in the database" });
        return;
      }

      db.get(
        `SELECT 1 FROM 'PROFILE' WHERE ID_PROFILE = ?`,
        [ID_PROFILE],
        (profileError, profileResult) => {
          if (profileError || !profileResult) {
            response
              .status(422)
              .json({ error: "ID_PROFILE not found in the database" });
            return;
          }

          db.run(
            `INSERT INTO 'TRANSACTION' (ID_CATEGORY, ID_PROFILE, TITLE, DATE, AMOUNT, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?)`,
            [ID_CATEGORY, ID_PROFILE, TITLE, DATE, AMOUNT, DESCRIPTION],
            (error) => {
              if (error) {
                response.status(400).json({ error: error.message });
              } else {
                response.status(201).json({ message: "created" });
              }
            }
          );
        }
      );
    }
  );
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction
 *     description: Creates a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_CATEGORY:
 *                 type: integer
 *               ID_PROFILE:
 *                 type: integer
 *               TITLE:
 *                 type: string
 *               DATE:
 *                 type: string
 *                 format: date
 *               AMOUNT:
 *                 type: number
 *                 minimum: 0.01
 *               DESCRIPTION:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       422:
 *         description: Unprocessable Entity
 *       500:
 *         description: Internal server error
 */
app.post("/transactions", (request, response) => {
  const { ID_CATEGORY, ID_PROFILE, TITLE, DATE, AMOUNT, DESCRIPTION } =
    request.body;

  if (AMOUNT <= 0) {
    response.status(422).json({ error: "AMOUNT must be greater than 0" });
    return;
  }

  db.get(
    `SELECT 1 FROM 'CATEGORY' WHERE ID_CATEGORY = ?`,
    [ID_CATEGORY],
    (categoryError, categoryResult) => {
      if (categoryError || !categoryResult) {
        response
          .status(422)
          .json({ error: "ID_CATEGORY not found in the database" });
        return;
      }

      db.get(
        `SELECT 1 FROM 'PROFILE' WHERE ID_PROFILE = ?`,
        [ID_PROFILE],
        (profileError, profileResult) => {
          if (profileError || !profileResult) {
            response
              .status(422)
              .json({ error: "ID_PROFILE not found in the database" });
            return;
          }

          db.run(
            `INSERT INTO 'TRANSACTION' (ID_CATEGORY, ID_PROFILE, TITLE, DATE, AMOUNT, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?)`,
            [ID_CATEGORY, ID_PROFILE, TITLE, DATE, AMOUNT, DESCRIPTION],
            (error) => {
              if (error) {
                response.status(404).json({ err: error.message });
              } else {
                response.status(201).json({ message: "created" });
              }
            }
          );
        }
      );
    }
  );
});

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     summary: Update a transaction by ID
 *     description: Updates a transaction with the specified ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_CATEGORY:
 *                 type: integer
 *               TITLE:
 *                 type: string
 *               DATE:
 *                 type: string
 *                 format: date
 *               AMOUNT:
 *                 type: number
 *                 minimum: 0.01
 *               DESCRIPTION:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction updated successfully
 *       404:
 *         description: Not found - resource not found
 *       422:
 *         description: Unprocessable Entity
 *       500:
 *         description: Internal server error
 */
app.put("/transactions/:id", (request, response) => {
  const { ID_CATEGORY, TITLE, DATE, AMOUNT, DESCRIPTION } = request.body;

  if (AMOUNT <= 0) {
    response.status(422).json({ error: "AMOUNT must be greater than 0" });
    return;
  }

  db.get(
    `SELECT 1 FROM 'CATEGORY' WHERE ID_CATEGORY = ?`,
    [ID_CATEGORY],
    (categoryError, categoryResult) => {
      if (categoryError || !categoryResult) {
        response
          .status(422)
          .json({ error: "ID_CATEGORY does not exist in the database" });
        return;
      }

      db.run(
        `UPDATE 'TRANSACTION' SET ID_CATEGORY=?, TITLE=?, DATE=?, AMOUNT=?, DESCRIPTION=? WHERE ID_TRANSACTION=?`,
        [ID_CATEGORY, TITLE, DATE, AMOUNT, DESCRIPTION, request.params.id],
        (error) => {
          if (error) {
            response.status(404).json({ err: error.message });
          } else {
            response.status(201).json({ message: "set" });
          }
        }
      );
    }
  );
});

/**
 * @swagger
 * /profiles:
 *   get:
 *     tags: [Profiles]
 *     summary: Get all profiles
 *     description: Returns all profiles stored in the database
 *     responses:
 *       200:
 *         description: A list of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Not found - resource not found
 *       500:
 *         description: Internal server error
 */
app.get("/profiles", (request, response) => {
  const query = `SELECT * FROM 'PROFILE';`;
  db.all(query, [], (error, rows) => {
    if (error) {
      response.status(404).json({ err: error.message });
    }
    rows.forEach((row) => {
      console.log(row);
    });
    response.json({ rows });
  });
});

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     tags: [Profiles]
 *     summary: Get a profile by ID
 *     description: Returns the profile with the specified ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the profile to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The profile with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Not found - profile not found
 *       500:
 *         description: Internal server error
 */
app.get("/profiles/:id", (request, response) => {
  const profileId = request.params.id;
  const query = `SELECT * FROM 'PROFILE' WHERE ID_PROFILE = ?;`;
  db.get(query, [profileId], (error, row) => {
    if (error) {
      response.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (!row) {
      response.status(404).json({ error: "Profile not found" });
      return;
    }
    response.json({ profile: row });
  });
});

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     tags: [Profiles]
 *     summary: Update a profile by ID
 *     description: Updates the name of the profile with the specified ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the profile to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request - missing or invalid data
 *       404:
 *         description: Not found - profile not found
 *       409:
 *         description: Conflict - profile name already exists
 *       500:
 *         description: Internal server error
 */
app.put("/profiles/:id", (request, response) => {
  const { NAME } = request.body;
  db.run(
    `UPDATE 'PROFILE' SET  NAME=? WHERE ID_PROFILE=?`,
    [NAME, request.params.id],
    (error) => {
      if (error) {
        if (error.code === "SQLITE_CONSTRAINT" && error.errno === 19) {
          response.status(409).json({ message: "Profile name already exists" });
        } else {
          response.status(500).json({ err: error.message });
        }
      } else {
        response.status(201).json({ message: "set" });
      }
    }
  );
});

/**
 * @swagger
 * /profiles:
 *   post:
 *     tags: [Profiles]
 *     summary: Create a new profile
 *     description: Creates a new profile with the provided name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *             required:
 *               - NAME
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       409:
 *         description: Conflict - profile name already exists
 */
app.post("/profiles", (request, response) => {
  const { NAME } = request.body;
  db.run(`INSERT INTO 'PROFILE' ( NAME ) VALUES ( ? )`, [NAME], (error) => {
    if (error) {
      response.status(409).json({ err: error.message });
    } else {
      response.status(201).json({ message: "created" });
    }
  });
});

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: Retrieves all categories from the database
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID_CATEGORY:
 *                         type: integer
 *                       NAME:
 *                         type: string
 *       404:
 *         description: Categories not found
 */
app.get("/categories", (request, response) => {
  const query = `SELECT * FROM 'CATEGORY';`;
  db.all(query, [], (error, rows) => {
    if (error) {
      response.status(404).json({ err: error.message });
    }
    rows.forEach((row) => {
      console.log(row);
    });
    response.json({ rows });
  });
});

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     tags: [Profiles]
 *     summary: Delete a profile and its transactions
 *     description: Deletes a profile and all its associated transactions from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the profile to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Profile and its transactions deleted successfully
 *       404:
 *         description: Profile not found
 */
app.delete("/profiles/:id", (request, response) => {
  db.run(
    `DELETE FROM 'TRANSACTION' WHERE ID_PROFILE IN (SELECT ID_PROFILE FROM 'PROFILE' WHERE ID_PROFILE = ?);`,
    [request.params.id],
    (error) => {
      if (error) {
        response.status(404).json({ err: error.message });
      } else {
        db.run(
          `DELETE FROM 'PROFILE' WHERE ID_PROFILE=?`,
          [request.params.id],
          (error) => {
            if (error) {
              response.status(404).json({ err: error.message });
            } else {
              response.status(204).json({ message: "deleted" });
            }
          }
        );
      }
    }
  );
});

/* */

app.get("/", (request, response, next) => {
  // response.header("Access-Control-Allow-Origin", "*");
  response.json({ status: "running" });
});

app.use(function (request, response, next) {
  response.status(404).send({ error: "404" });
});

app.listen(_PORT_, () => {
  console.log(`http://localhost:${_PORT_}`);
});
