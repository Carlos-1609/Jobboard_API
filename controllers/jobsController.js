export const getAllJobs = (req, res, next) => {
  return res.status(200).json({ msg: "This are all the jobs" });
};
