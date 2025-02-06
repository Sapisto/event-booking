'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("bookings", "ticketsBooked", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, 
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("bookings", "ticketsBooked");
  },
};

