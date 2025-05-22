'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                validate: { isEmail: true }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { len: [6] }
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'student',
                validate: {
                    isIn: [['student', 'employer']]
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('positions', {
            positionId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            position: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('skills', {
            skillId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            skill: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('students', {
            studentId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: { isEmail: true },
                references: {
                    model: 'users',
                    key: 'email'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING(20),
                validate: {
                    is: /^[\+\d\s\-\(\)]{5,20}$/i
                }
            },
            resumeStatus: {
                type: Sequelize.STRING,
                defaultValue: 'resume not uploaded',
                validate: {
                    isIn: [['resume not uploaded', 'resume uploaded']]
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('employers', {
            employerId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true },
                references: {
                    model: 'users',
                    key: 'email'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING(20),
                validate: {
                    is: /^[\+\d\s\-\(\)]{5,20}$/i
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('vacancies', {
            vacancyId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            vacancyType: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [
                        [
                            'полная занятость',
                            'частичная занятость',
                            'удалённая работа',
                            'ассистент преподавателя',
                            'помощь в административных отделах',
                            'участие в исследовательских проектах',
                            'стажировка в партнёрских организациях'
                        ]
                    ]
                }
            },
            positionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'positionId'
                },
                onDelete: 'RESTRICT'
            },
            companyName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            min_salary: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            max_salary: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            vacancyDescription: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            vacancyStatus: {
                type: Sequelize.STRING,
                defaultValue: 'created',
                validate: {
                    isIn: [['created', 'posted', 'closed']]
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('applications', {
            applicationId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            vacancyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'vacancies',
                    key: 'vacancyId'
                },
                onDelete: 'CASCADE'
            },
            applicationStatus: {
                type: Sequelize.STRING,
                defaultValue: 'posted',
                validate: {
                    isIn: [['posted', 'accepted', 'rejected']]
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('resume', {
            studentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'students',
                    key: 'studentId'
                },
                onDelete: 'CASCADE'
            },
            resume: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Связующие таблицы many-to-many
        await queryInterface.createTable('employers_vacancies', {
            vacancyId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'vacancies',
                    key: 'vacancyId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            employerId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'employers',
                    key: 'employerId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            skillId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'skills',
                    key: 'skillId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
                onDelete: 'CASCADE'
            },
            skillId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'skills',
                    key: 'skillId'
                },
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('students_application', {
            applicationId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'applications',
                    key: 'applicationId'
                },
                onDelete: 'CASCADE'
            },
            studentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'students',
                    key: 'studentId'
                },
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface) {
        // Удаляем в обратном порядке с учётом зависимостей
        await queryInterface.dropTable('students_application');
        await queryInterface.dropTable('students_skills');
        await queryInterface.dropTable('necessary_skills');
        await queryInterface.dropTable('employers_vacancies');
        await queryInterface.dropTable('resume');
        await queryInterface.dropTable('applications');
        await queryInterface.dropTable('vacancies');
        await queryInterface.dropTable('employers');
        await queryInterface.dropTable('students');
        await queryInterface.dropTable('skills');
        await queryInterface.dropTable('positions');
        await queryInterface.dropTable('users');
    }
};