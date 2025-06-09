#!/bin/bash

# Run backend tests
cd backend
npm test
npm run test:e2e
cd ..
