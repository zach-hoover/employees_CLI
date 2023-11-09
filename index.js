const inquirer = require('inquirer')
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Cavsfanatic10',
      database: 'employees_db'
    },
    console.log(`Connected to the books_db database.`)
  );

function viewDepartments() {
    const sql = `SELECT * FROM departments`;
    
    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(rows); 
      init()
    });
  }
  
function viewRoles() {
    // Implement viewRoles similarly
    const sql = `SELECT * FROM roles`;
          
    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(rows); 
      init()
    });
  }
  
function viewEmployees() {
    // Implement viewEmployees similarly
    const sql = `SELECT * FROM employees`;
          
    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(rows);
      init() 
    });
  };
  
function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'department_name',
          message: 'What is the department called?',
        }
      ])
      .then((answers) => {
        const sql = `INSERT INTO departments (department_name) VALUES (?)`;
        const params = [answers.department_name];
      
        db.query(sql, params, (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Added department: ${answers.department_name}`);
          init()
        });
      });
  }

function addEmployee() {
    const sql = 'SELECT title, id FROM roles; SELECT first_name, last_name, id FROM employees'; 
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      const roles = results[0].map((row) => row.title);
      const employees = results[1].map((row) => `${row.first_name} ${row.last_name}`);
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'What is there first name?',
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'What is there last name?',
          },
          {
            type: 'list',
            name: 'role',
            message: 'What is there role?',
            choices: roles
          },
          {
            type: 'list',
            name: 'manager',
            message: 'Who is there manager?',
            choices: [employees, 'none'], 
          }
        ])
        .then((answers) => {
          const roleId = results[0].find((row) => row.title === answers.role).id;
          const managerName = answers.manager !== 'none' ? answers.manager.split(' ') : null;
          const managerId = managerName ? results[1].find((row) => row.first_name === managerName[0] && row.last_name === managerName[1]).id : null;

          const sql = 'INSERT INTO roles (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)'; 
          const params = [answers.first_name, answers.last_name, roleId, managerId];
        
          db.query(sql, params, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
            init();
          });
        });
    });
  }

  function addRole() {
    const sql = 'SELECT department_name, id FROM departments'; 
    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      const departments = rows.map((row) => row.department_name); 
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the role called?',
          },
          {
            type: 'number',
            name: 'salary',
            message: 'How much does this role pay?',
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does this role belong to?',
            choices: departments, 
          }
        ])
        .then((answers) => {
          const departmentId = rows.find((row) => row.department_name === answers.department).id; 
          const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)'; 
          const params = [answers.title, answers.salary, departmentId];
        
          db.query(sql, params, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Added role: ${answers.title}`);
            init();
          });
        });
    });
  }
function updateRole() {
  const sql = 'SELECT first_name, last_name, id FROM employees; SELECT title, id FROM roles';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    const employees = results[0].map((row) => `${row.first_name} ${row.last_name}`);
    const roles = results[1].map((row) => row.title);
    inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Who would you like to update?',
            choices: employees, 
          },
          {
            type: 'list',
            name: 'role',
            message: 'What is there role?',
            choices: roles, 
          },
        ])
        .then((answers) => {
          const employeeName = answers.employee.split(' ')
          const employeeId = results[0].find((row) => row.first_name === employeeName[0] && row.last_name === employeeName[1]).id
          const roleId = results[1].find((row) => row.title === answers.role).id
          const sql = 'UPDATE employees SET role_id = ? WHERE id = ?'; 
          const params = [ roleId, employeeId ];
        
          db.query(sql, params, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Updated Employee: ${answers.employee}`);
            init();
          });
        });
  })
}


const init = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    }
  ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          // Handle view all departments
          viewDepartments()
        
        break;
        case 'View all roles':
          // Handle view all roles
          viewRoles()
      
        break;
        case 'View all employees':
          // Handle view all employees
          viewEmployees()
        
        break;
        case 'Add a department':
          // Handle add department
          addDepartment()
        
        break;
        case 'Add a role':
          // Handle add role
          addRole()
        break;
        case 'Add an employee':
          // Handle add employee
          addEmployee()
        break;
        case 'Update an employee role':
          // Handle update employee role
          updateRole()
        break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit();
      }
    })
    .catch((err) => console.error(err));
};
init()