const { Sequelize } = require('sequelize');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['student', 'employer']]
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('students', {
            studentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            resumeStatus: {
                type: Sequelize.STRING,
                defaultValue: 'not_uploaded'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('employers', {
            employerId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('positions', {
            positionId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            position: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('vacancies', {
            vacancyId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            vacancyType: {
                type: Sequelize.STRING,
                allowNull: false
            },
            positionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'positionId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            companyName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            min_salary: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            max_salary: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            vacancyDescription: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            vacancyStatus: {
                type: Sequelize.STRING,
                defaultValue: 'created'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('employers_vacancies', {
            vacancyId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'vacancies',
                    key: 'vacancyId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            employerId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'employers',
                    key: 'employerId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('skills', {
            skillId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            skill: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('necessary_skills', {
            vacancyId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'vacancies',
                    key: 'vacancyId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            skillId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'skills',
                    key: 'skillId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('students_skills', {
            studentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'students',
                    key: 'studentId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            skillId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'skills',
                    key: 'skillId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('applications', {
            applicationId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            vacancyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'vacancies',
                    key: 'vacancyId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            applicationStatus: {
                type: Sequelize.STRING,
                defaultValue: 'posted'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('students_applications', {
            applicationId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'applications',
                    key: 'applicationId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            studentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'students',
                    key: 'studentId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable('resumes', {
            resumeId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            studentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'students',
                    key: 'studentId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        console.log('Все таблицы успешно созданы!');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('students_applications');
        await queryInterface.dropTable('applications');
        await queryInterface.dropTable('resumes');
        await queryInterface.dropTable('students_skills');
        await queryInterface.dropTable('necessary_skills');
        await queryInterface.dropTable('skills');
        await queryInterface.dropTable('employers_vacancies');
        await queryInterface.dropTable('vacancies');
        await queryInterface.dropTable('positions');
        await queryInterface.dropTable('students');
        await queryInterface.dropTable('employers');
        await queryInterface.dropTable('users');

        console.log('Все таблицы успешно удалены!');
    }
};