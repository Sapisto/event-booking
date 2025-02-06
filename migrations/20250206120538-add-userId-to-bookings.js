module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("bookings", "userId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("bookings", "userId");
  },
};
