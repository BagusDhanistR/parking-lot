'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tickets.init({
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: "please enter your vehicle type"
        },
        notEmpty: {
          msg: "please enter your vehicle type"
        }
      }
    },
    time_in: {
      type: DataTypes.DATE,
      allowNull:false,
      validate: {
        notNull: {
          msg: "please enter your time in"
        },
        notEmpty: {
          msg: "please enter your time in"
        }
      }
    },
    time_out: {
      type: DataTypes.DATE,
      allowNull:false,
      validate: {
        notNull: {
          msg: "please enter your time out"
        },
        notEmpty: {
          msg: "please enter your time out"
        }
      }
    },
    total_payment: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {
          msg: "please enter your total payment"
        },
        notEmpty: {
          msg: "please enter your total payment"
        }
      }
    },
  }, {
    sequelize,
    validate: {
      lessThanTimeIn() {
        if (this.time_out < this.time_in) {
          throw new Error('time out must be greater than time in');
        }
      }
    },
    modelName: 'Tickets',
  });
  return Tickets;
};