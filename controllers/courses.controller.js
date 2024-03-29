const asyncHandler = require("express-async-handler");
const Course = require("../models/courses.model");

//@desc     Create a course
//@route    POST /api/courses/create
//@access   Private ADMIN
const createCourse = asyncHandler(async (req, res) => {
  const { code, name, max_mark, min_mark, appointment, year, department } =
    req.body;
  //check all required fields
  if (
    !code ||
    !name ||
    !max_mark ||
    !min_mark ||
    !appointment ||
    !year ||
    !department
  ) {
    res.status(400);
    throw new Error("Please complete all fields");
  }
  //check if a two courses has the same appointment or not
  const { day, time } = appointment?.date;
  const courseExist = !!(await Course.findOne({
    year,
    "appointment.date.day": day,
    "appointment.date.time": time,
  }));
  if (courseExist) {
    res.status(400);
    throw new Error("this appointment is already taken");
  }
  //create actual user
  const newCourse = await Course.create({
    code,
    name,
    max_mark,
    min_mark,
    appointment,
    year,
    department,
  });
  //respond
  res.status(201).json({ ...newCourse?._doc });
});

//@desc     Get all courses
//@route    POST /api/courses/all
//@access   Private ADMIN
const getAllCourses = asyncHandler(async (req, res) => {
  const { skip, limit } = req.pagination;
  const courses = await Course.find()
    .populate("department")
    .skip(skip)
    .limit(limit);
  res.status(200).json({ count: courses.length, result: courses });
});

//@desc     Get one course
//@route    GET /api/courses/:id
//@access   Private ADMIN
const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findOne({ _id: courseId }).populate("department");
  res.status(200).json({ course });
});

//@desc     Delete one course
//@route    DELETE /api/courses/:id
//@access   Private ADMIN
const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  //check if the course exist or not
  const course = await Course.findOne({ _id: courseId });
  const courseExists = !!course;
  if (!courseExists) {
    res.status(400);
    throw new Error("this course doesn't exist");
  }
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({
    message: "Deleted Successfully",
    deletedCourse: course,
  });
});

//@desc     update one course
//@route    PUT /api/courses/:id
//@access   Private ADMIN
const updateCourse = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const updateFields = req.body;
  const oldCourse = await Course.findOne({ _id: itemId });
  //check if a two courses has the same appointment or not
  if (updateFields.appointment) {
    const { day, time } = updateFields.appointment?.date;
    const courseExist = !!(await Course.findOne({
      year: oldCourse?.year,
      "appointment.date.day": day,
      "appointment.date.time": time,
    }));
    if (courseExist) {
      res.status(400);
      throw new Error("this appointment is already taken");
    }
  }

  // Update the item in the database
  const updatedItem = await Course.findByIdAndUpdate(
    itemId,
    {
      ...updateFields,
      //   appointment: { ...oldCourse.appointment, ...updateFields },
    },
    {
      new: true,
      runValidators: true,
    }
  ); // Set runValidators to true to run validation on update
  res.status(200).json({ message: "updated successfully", data: updatedItem });
});
module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
};
