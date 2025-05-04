import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchtHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const username = req.query.username;
  const userFound = await user.findOneByUsername(username);
  return res.status(200).json(userFound);
}

async function patchtHandler(req, res) {
  const username = req.query.username;
  const userInputValues = req.body;
  const updatedUser = await user.update(username, userInputValues);
  return res.status(200).json(updatedUser);
}
