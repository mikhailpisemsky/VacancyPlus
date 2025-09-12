module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'students_applications' 
                    AND column_name = 'StudentStudentId'
                ) THEN
                    ALTER TABLE students_applications 
                    DROP COLUMN "StudentStudentId";
                END IF;
            END $$;
        `);

        console.log('Таблица students_applications исправлена');
    },

    async down(queryInterface, Sequelize) {
        console.log('Откат миграции не требуется');
    }
};