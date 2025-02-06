import swaggerAutogen from 'swagger-autogen';
import { glob } from 'glob';

const doc = {
  info: {
    version: '3.1.0',
    title: 'Event Booking Web Api',
    description: 'Description of your API',
  },
  host: 'localhost:3000', 
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = glob.sync('./src/routes/*.ts'); 

swaggerAutogen()(outputFile, endpointsFiles, doc);
