const Role = require('../models/roles');
const { sendResponse } = require('../Utilities/response');

const roleController = {
    // Create a new role
    create: async (req, res) => {
        try {
            const { name, permissions } = req.body;

            const existingRole = await Role.findOne({ name });

            if (existingRole) {
                return sendResponse(res, null, 'Role already exists', 400);
            }

            const role = new Role({ name, permissions });
            const savedRole = await role.save();

            return sendResponse(res, savedRole, null, 201);
        } catch (error) {
            return sendResponse(res, null, error.message, 500);
        }
    },

    // Get all roles
    getAll: async (req, res) => {
        try {
            const roles = await Role.find();
            return sendResponse(res, roles);
        } catch (error) {
            return sendResponse(res, null, error.message, 500);
        }
    },

    // Get role by id
    getById: async (req, res) => {
        try {
            const role = await Role.findById(req.params.id);
            if (!role) {
                return sendResponse(res, null, 'Role not found', 404);
            }
            return sendResponse(res, role);
        } catch (error) {
            return sendResponse(res, null, error.message, 500);
        }
    },

    // Update role
    update: async (req, res) => {
        try {
            const { name, permissions } = req.body;

            const role = await Role.findById(req.params.id);
            if (!role) {
                return sendResponse(res, null, 'Role not found', 404);
            }

            if (name && name !== role.name) {
                const existingRole = await Role.findOne({ name });
                if (existingRole) {
                    return sendResponse(res, null, 'Role name already exists', 400);
                }
            }

            const updatedRole = await Role.findByIdAndUpdate(
                req.params.id,
                { name, permissions },
                { new: true, runValidators: true }
            );

            return sendResponse(res, updatedRole);
        } catch (error) {
            return sendResponse(res, null, error.message, 500);
        }
    },

    // Delete role
    delete: async (req, res) => {
        try {
            const role = await Role.findByIdAndDelete(req.params.id);
            if (!role) {
                return sendResponse(res, null, 'Role not found', 404);
            }
            return sendResponse(res, { message: 'Role deleted successfully' });
        } catch (error) {
            return sendResponse(res, null, error.message, 500);
        }
    }
};

module.exports = roleController;
