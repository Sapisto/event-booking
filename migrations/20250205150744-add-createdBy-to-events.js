"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the createdBy column to the events table
    await queryInterface.addColumn("events", "createdBy", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users", // Ensure this matches your users table name
        key: "id",
      },
      onDelete: "CASCADE", // Optional: Automatically deletes events if the associated user is deleted
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverting the change (removing createdBy column)
    await queryInterface.removeColumn("events", "createdBy");
  },
};
