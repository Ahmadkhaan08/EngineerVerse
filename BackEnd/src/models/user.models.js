import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudinary URL
        },
        coverImage: {
            type: String, // cloudinary URL
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
        },
        refreshToken: {
            type: String,
        },
        skills: {
            type: [String], // Array of strings representing skills
            // required: true,
        },
        experience: [
            {
                title: String,       
                company: String,     
                startDate: Date,     
                endDate: Date,       
                description: String, 
            }
        ],
        projects: [
            {
                name: String,         
                description: String,  
                technologies: [String],
                link: String,         
                startDate: Date,
                endDate: Date,
            }
        ],
        education: [
            {
                school: String,       
                degree: String,       
                fieldOfStudy: String, 
                startDate: Date,
                endDate: Date,
            }
        ],
        bio: {
            type: String,            
            trim: true,
        },
        website: {
            type: String,            
            trim: true,
        },
        resume: {
            type: String,  // URL of the uploaded resume (PDF or DOC)
            required: false,
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId, // Reference to User model
                ref: 'User',
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId, // Reference to User model
                ref: 'User',
            }
        ],
        location: {
            type: String,
            default: "Unknown",
            trim: true
        },
        title: {
            type: String,
            default: "Engineer"
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    // Await bcrypt hashing
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (inputPassword) {
    // Compare the hashed password in the DB with the input password
    const corr =  await bcrypt.compare(inputPassword, this.password);
    console.log(corr)
    return corr
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET, // Ensure correct env variable name
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Ensure this is correctly defined in .env
        }
    );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Ensure correct env variable name
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Ensure this is correctly defined in .env
        }
    );
};

export const User = mongoose.model("User", userSchema);