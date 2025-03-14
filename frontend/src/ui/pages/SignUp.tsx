import { Link } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Kayıt Ol <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form className="space-y-4">
          <div>
            <label className="label mb-1">
              <span className="text-base label-text">Ad Soyad</span>
            </label>
            <input
              type="text"
              placeholder="Adınızı ve Soyadınızı Girin"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label mb-1">
              <span className="text-base label-text">Kullanıcı adı</span>
            </label>
            <input
              type="text"
              placeholder="Kullanıcı Adınızı Girin"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label mb-1">
              <span className="text-base label-text">Şifre</span>
            </label>
            <input
              type="password"
              placeholder="Şifrenizi Girin"
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="label mb-1">
              <span className="text-base label-text">Şifreyi onayla</span>
            </label>
            <input
              type="password"
              placeholder="Şifrenizi Onaylayın"
              className="w-full input input-bordered h-10"
            />
          </div>

          <GenderCheckbox />

          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white"
          >
            Zaten bir hesabın var mı?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2 border border-slate-700">
              Kayıt Ol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
