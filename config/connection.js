const mongoose = require ("mongoose");

// Wrap Mongoose around local connection to MongoDB
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/social-network",{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
);

//log mongo queries being executed
mongoose.sert("debug", true);

// Export connection 
module.export = mongoose.connection;