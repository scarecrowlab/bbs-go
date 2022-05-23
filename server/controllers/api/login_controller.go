package api

import (
	"bbs-go/controllers/render"

	"github.com/kataras/iris/v12"
	"github.com/mlogclub/simple/web"

	"bbs-go/services"
)

type LoginController struct {
	Ctx iris.Context
}

// 注册
func (c *LoginController) PostSignup() *web.JsonResult {
	var (
		email       = c.Ctx.PostValueTrim("email")
		username    = c.Ctx.PostValueTrim("username")
		password    = c.Ctx.PostValueTrim("password")
		rePassword  = c.Ctx.PostValueTrim("rePassword")
		nickname    = c.Ctx.PostValueTrim("nickname")
		ref         = c.Ctx.FormValue("ref")
	)
	loginMethod := services.SysConfigService.GetLoginMethod()
	if !loginMethod.Password {
		return web.JsonErrorMsg("账号密码登录/注册已禁用")
	}

	user, err := services.UserService.SignUp(username, email, nickname, password, rePassword)
	if err != nil {
		return web.JsonErrorMsg(err.Error())
	}
	return render.BuildLoginSuccess(user, ref)
}

// 用户名密码登录
func (c *LoginController) PostSignin() *web.JsonResult {
	var (
		username    = c.Ctx.PostValueTrim("username")
		password    = c.Ctx.PostValueTrim("password")
		ref         = c.Ctx.FormValue("ref")
	)
	// loginMethod := services.SysConfigService.GetLoginMethod()
	// if !loginMethod.Password {
	// 	return web.JsonErrorMsg("账号密码登录/注册已禁用")
	// }
	user, err := services.UserService.SignIn(username, password)
	if err != nil {
		return web.JsonErrorMsg(err.Error())
	}
	return render.BuildLoginSuccess(user, ref)
}

// 退出登录
func (c *LoginController) GetSignout() *web.JsonResult {
	err := services.UserTokenService.Signout(c.Ctx)
	if err != nil {
		return web.JsonErrorMsg(err.Error())
	}
	return web.JsonSuccess()
}
