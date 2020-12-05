const getValidSchema = {
    username: {
        in: ["params"],
        isEmail: true
    }
}

const postValidSchema = {
    username: {
        in: ["params"],
        isEmail: true
    }
}

const putValidSchema = {
    username: {
        in: ["params"],
        isEmail: true
    },
    id: {
        in: ["params"],
        isMongoId: true
    }
}

const petValidSchema = {
    name: {
        in: ["body"],
        isAlphanumeric: true,
        isLength: {
            options: { min: 1 }
        }
    },
    birthdate: {
        in: ["body"],
        isDate: {
            options: { format: "YYYY/MM/DD" }
        }
    },
    gender: {
        in: ["body"],
        isIn: {
            options: [["", "--Select--", "Male", "Female", "Other", "Unknown"]]
        }
    },
    species: {
        in: ["body"],
        isIn: {
            options: [["", "--Select--", "Bird", "Cat", "Dog", "Fish", "Frog",
                "Horse", "Spider", "Other"]]
        }
    },
    weight: {
        in: ["body"],
        isFloat: {
            options: { min: 0.0, max: 300.0 }
        }
    }
}

module.exports = {
    getValidSchema,
    postValidSchema,
    putValidSchema,
    petValidSchema
}