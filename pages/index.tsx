import Head from "next/head";
import axios from "axios";
import bg from "../public/background.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import supabase from "../supabase-config";
import { useRouter } from "next/router";

import Countdown from "react-countdown";
export default function Home() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [offer, setOffer] = useState(1);
  const [province, setProvince] = useState("");
  const [number, setNumber] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [numberErr, setNumberErr] = useState(false);
  const [provinceErr, setProvinceErr] = useState(false);
  const [communeErr, setCommuneErr] = useState(false);
  const [commune, setCommune] = useState("");
  const [formErr, setFormErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any>([]);
  const [agentsCount, setAgentsCount] = useState(0);
  const router = useRouter();

  const Completionist = () => <span>You are good to go!</span>;
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <div className="w-full flex justify-center">
          <span className="flex mt-4">
            <span>
              <span className="h-16 mr-1 rounded-tl-md rounded-tr-md w-16 flex justify-center items-center bg-red-600 text-white text-5xl">
                {days}
              </span>
              <span className="w-16 flex rounded-bl-md rounded-br-md justify-center bg-white">
                أيام
              </span>
            </span>
            <span>
              <span className="h-16 mr-1 rounded-tl-md rounded-tr-md w-16 flex justify-center items-center bg-red-600 text-white text-5xl">
                {hours}
              </span>
              <span className="w-16 flex rounded-bl-md rounded-br-md justify-center bg-white">
                ساعة
              </span>
            </span>
            <span>
              <span className="h-16 mr-1 rounded-tl-md rounded-tr-md w-16 flex justify-center items-center bg-red-600 text-white text-5xl">
                {minutes}
              </span>
              <span className="w-16 flex rounded-bl-md rounded-br-md justify-center bg-white">
                دقيقة
              </span>
            </span>
            <span>
              <span className="h-16 mr-1 rounded-tl-md rounded-tr-md w-16 flex justify-center items-center bg-red-600 text-white text-5xl">
                {seconds}
              </span>
              <span className="w-16 flex rounded-bl-md rounded-br-md justify-center bg-white">
                ثانية
              </span>
            </span>
          </span>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("role", "agent");

        if (data) {
          console.log("the data tracker: ", data);
          setAgents(data);
          setAgentsCount(data.length);
        }

        if (error) {
          console.log("something went wrong ", error);
        }
      } catch (error) {
        console.log("catched an error ", error);
      }
    };

    fetchAgents();
  }, []);

  const handleAddLead = async (e: any) => {
    e.preventDefault();
    if (fullName !== "" && province !== "" && commune !== "" && number !== "") {
      try {
        setIsLoading(true);
        let agentId;
        if (agentsCount !== 0) {
          agentId = agents[Math.floor(Math.random() * agentsCount)].id;
        } else {
          agentId = null;
        }
        const { error } = await supabase.from("leads").insert({
          first_name: fullName,
          last_name: "",
          address,
          phone: `${number}`,
          wilaya: province,
          commune,
          product: "زيت اللحية",
          agent_id: agentId,
        });
        if (error) {
          setFormErr(false);
        } else {
          router.push("/thankyou");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErr(true);
    }
  };

  const handleSetError = (field: string) => {
    if (field == "name") {
      if (fullName === "") {
        setNameErr(true);
      } else {
        setNameErr(false);
      }
    } else if (field === "number") {
      if (number === "") {
        setNumberErr(true);
      } else {
        setNumberErr(false);
      }
    } else if (field === "province") {
      if (province === "") {
        setProvinceErr(true);
      } else {
        setProvinceErr(false);
      }
    } else if (field === "commune") {
      if (commune === "") {
        setCommuneErr(true);
      } else {
        setCommuneErr(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Agivahuile - beard oil</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="facebook-domain-verification"
          content="1frq0jk9he9bwvamsmq20hol2keroj"
        />
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <div
        className="bg-auto bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${bg.src})`,
          // backgroundSize: "100%",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          backgroundColor: "#333",
          backgroundBlendMode: "overlay",
        }}
      >
        <header className="bg-black fixed top-0 h-20 w-full">
          <div className="w-full flex justify-between px-3 py-3">
            <div className="py-3">
              <img src="logo.avif" className="h-8" alt="" />
            </div>
            <div className=" mt-3">
              <a
                href="#form"
                className="text-white bg-red-700 px-6 py-3 rounded-lg font-bold"
              >
                أطلب الآن
              </a>
            </div>
          </div>
        </header>
        <main className="w-full  mt-20 px-6">
          <div className="w-full pt-4 pb-8 text-center text-white z-10 mt-4">
            <h1 className="text-5xl mb-2">
              أحصل على لحية مميزة في أسابيع قليلة
            </h1>
            <h6 className="text-2xl">
              الزيت الأصلي من شركة أجيفا العالمية الذي يساعد على تعزيز نمو شعر
              اللحية بشكل صحي وملئ الفراغات
            </h6>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="w-full hidden md:block">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/rROMvEdmtZ4"
                className="w-full  rounded-2xl overflow-hidden mb-4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="text-white text-right mt-4">
                <h1 className="text-xl mb-2">
                  هل تعاني من الفرغات في اللحية ؟ او تريد الحصول على لحية مميزة؟
                </h1>
                <p>
                  نقدم لكم الزيت الأصلي من شركة أجيفا العالمية الذي يساعد على
                  تعزيز نمو شعر اللحية بشكل صحي وملئ الفراغات خصوصا الأشخاص
                  للذين يعانون من فراغات اللحية كما انه يساعد على نمو اسرع ب 5
                  اضعاف والحفاظ على لمعان شعر اللحية
                </p>
              </div>
              <div className="text-white text-right mt-8">
                <h1 className="text-xl mb-2">
                  :زيت اللحية لأجيفا يتكون من 4 زيوت{" "}
                </h1>
                <div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت الأرغان يغدي اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      1
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت اللوز يقوي من شعر اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      2
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت الجوجوبا يرطب اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      3
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت جوز الهند يساعد على لمعان شعر اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      4
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between hidden">
                <Image
                  src="/arrowdown.png"
                  width={72}
                  height={72}
                  alt=""
                  className="-scale-x-100"
                />
                <Image src="/arrowdown.png" width={72} height={72} alt="" />
              </div>
              <div
                className="bg-[#1f1f1f] rounded-2xl border-2 py-4 px-6 border-[#dc111f]"
                id="form"
              >
                <h1 className="text-3xl text-white font-bold text-center">
                  <span className="text-red-500">(35% PROMO)</span> <br />
                  أطلب الآن واستفد من تخفيض شهر رمضان{" "}
                </h1>
                {/* 
                <div className="  my-4 py-4 rounded-lg bg-white/5">
                  <h1 className="text-2xl text-red-500 text-center">
                    العرض ينتهي خلال
                  </h1>
                  <Countdown
                    date={new Date("2023-03-15T00:00:00")}
                    renderer={renderer}
                  />
                </div> */}
                <h3 className="text-lg text-white text-center">
                  للطلب يرجى ملء هذا النموذج وسوف نتصل بك للتاكيد{" "}
                </h3>
                <form action="#" method="post">
                  <div>
                    <label className="label w-full text-right block mt-3">
                      <span className="label-text text-white right-0">
                        الإسم و اللقب
                      </span>
                    </label>
                    <input
                      type="text"
                      className="p-3 mt-2 bg-white rounded-md w-full text-right"
                      placeholder="الإسم و اللقب"
                      value={fullName}
                      onBlur={() => handleSetError("name")}
                      required
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {nameErr && (
                      <p className="text-right text-red-600">ادخل الاسم</p>
                    )}
                  </div>
                  <div>
                    <label className="label w-full text-right block mt-3">
                      <span className="label-text text-white">رقم الهاتف</span>
                    </label>
                    <input
                      type="number"
                      className="p-3 mt-2 bg-white rounded-md w-full  text-right"
                      placeholder="رقم الهاتف"
                      value={number}
                      onBlur={() => handleSetError("number")}
                      required
                      onChange={(e) => setNumber(e.target.value)}
                    />
                    {numberErr && (
                      <p className="text-right text-red-600">
                        الرجاء إدخال رقم الهاتف
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label w-full text-right block mt-3">
                      <span className="label-text text-white">الولاية</span>
                    </label>
                    <input
                      type="text"
                      className="p-3 mt-2 bg-white rounded-md w-full  text-right"
                      placeholder="الولاية"
                      value={province}
                      onBlur={() => handleSetError("province")}
                      required
                      onChange={(e) => setProvince(e.target.value)}
                    />
                    {provinceErr && (
                      <p className="text-right text-red-600">
                        الرجاء إدخال الولاية
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label w-full text-right block mt-3">
                      <span className="label-text text-white">البلدية</span>
                    </label>
                    <input
                      type="text"
                      className="p-3 mt-2 bg-white rounded-md w-full  text-right"
                      placeholder="البلدية"
                      value={commune}
                      onBlur={() => handleSetError("commune")}
                      required
                      onChange={(e) => setCommune(e.target.value)}
                    />
                    {communeErr && (
                      <p className="text-right text-red-600">
                        الرجاء إدخال البلدية
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <label className="label w-full text-right block mt-3">
                      <span className="label-text text-white">العنوان</span>
                    </label>
                    <input
                      type="text"
                      className="p-3 mt-2 bg-white rounded-md w-full text-right"
                      placeholder="العنوان"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div> */}

                  <div>
                    <div>
                      <div className="">
                        <p className="text-white mr-3 my-6 text-lg text-center">
                          35% تخفيض
                        </p>
                        <p className="sm:flex block text-center justify-center">
                          <span className="text-6xl text-green-500 font-bold  block sm:inline">
                            2900 DA
                          </span>
                          <span className="text-gray-50 text-lg line-through block sm:inline">
                            4450 DA
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {formErr && (
                      <p className="text-center text-white bg-red-600/60 py-3 rounded-lg mt-4">
                        الرجاء إدخال جميع المعلومات
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      // disabled={!fullName || !number || !province}
                      onClick={handleAddLead}
                      disabled={isLoading}
                      type="submit"
                      className="bg-[#dc111f] button-bounce text-2xl rounded-lg w-full p-4 text-center text-white font-bold hover:bg-[#cf0c19]"
                    >
                      {isLoading && <span className="loader"></span>}أطلب الآن
                    </button>
                  </div>
                </form>
              </div>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/rROMvEdmtZ4"
                className="w-full  rounded-2xl overflow-hidden md:hidden mt-4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="w-full block md:hidden">
              {/* <iframe
                // width="560"
                height="315"
                className="w-full  rounded-2xl overflow-hidden"
                src="https://www.youtube.com/embed/cB2vnyM5sEM"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe> */}
              <div className="text-white text-right mt-4">
                <h1 className="text-xl mb-2">
                  هل تعاني من الفرغات في اللحية ؟ او تريد الحصول على لحية مميزة؟
                </h1>
                <p>
                  نقدم لكم الزيت الأصلي من شركة أجيفا العالمية الذي يساعد على
                  تعزيز نمو شعر اللحية بشكل صحي وملئ الفراغات خصوصا الأشخاص
                  للذين يعانون من فراغات اللحية كما انه يساعد على نمو اسرع ب 5
                  اضعاف والحفاظ على لمعان شعر اللحية
                </p>
              </div>
              <div className="text-white text-right mt-8">
                <h1 className="text-xl mb-2">
                  :زيت اللحية لأجيفا يتكون من 4 زيوت{" "}
                </h1>
                <div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت الأرغان يغدي اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      1
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت اللوز يقوي من شعر اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      2
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت الجوجوبا يرطب اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      3
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> زيت جوز الهند يساعد على لمعان شعر اللحية</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      4
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end my-6">
                <img src="testm.jpg" />
              </div>
              <div className="text-white text-right mt-8 mb-6">
                <h1 className="text-xl mb-2">:طريقة الإستعمال </h1>
                <div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> تغسل اللحية جيدا بالماء والغسول</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      1
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span> تقوم بتجفيفها جيدا من الماء</span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      2
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span>
                      {" "}
                      تضع قطرات من زيت أجيفا ثم تقوم بتدليك اللحية جيدا لمدة 2
                      دقيقة
                    </span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      3
                    </span>
                  </div>
                  <div className="flex text-right w-full justify-end mt-3">
                    <span>
                      {" "}
                      تقوم بتكرير العملية يوميا والمداومة عليها لتظهر النتيجة في
                      وقت قصير
                    </span>
                    <span className=" h-6 w-6 text-black pt-0 pr-0 ml-3 items-center text-center rounded-full bg-white">
                      4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div></div>
        </main>
      </div>
    </>
  );
}
