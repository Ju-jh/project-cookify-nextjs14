"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./css/page.module.css";
import { faFileArrowUp, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Posting() {
  const [isTitle, setIsTitle] = useState("");
  const [isOnTitle, setIsOnTitle] = useState(false);
  const [isTitleValue, setIsTitleValue] = useState("");
  const [isImage, setIsImage] = useState("");
  const [isSteps, setIsSteps] = useState<string[]>([""]);
  const [isIngredients1, setIsIngredients1] = useState<string[]>([]);
  const [isIngredients2, setIsIngredients2] = useState<string[]>([]);
  const [isIngredients, setIsIngredients] = useState(false);
  const [isIngredientName1, setIsIngredientName1] = useState("");
  const [isIngredientWeight1, setIsIngredientWeight1] = useState("");
  const [isIngredientName2, setIsIngredientName2] = useState("");
  const [isIngredientWeight2, setIsIngredientWeight2] = useState("");
  const [isUser, setIsUser] = useState({ email: "", name: "", picture: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recipeTitle = () => {
    setIsOnTitle(!isOnTitle);
    setIsTitle(isTitleValue);
  };

  const recipeTitleInput = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setIsTitleValue(e.target.value);
  };

  const imageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log(fileInputRef.current?.value);
    }
  };

  const recipeIngredients1 = () => {
    const data = [
      ...isIngredients1,
      isIngredientName1 + " " + isIngredientWeight1,
    ];
    setIsIngredients1(data);
    setIsIngredientName1("");
    setIsIngredientWeight1("");
  };
  const ingredientName1 = (e: { target: { value: any } }) => {
    setIsIngredientName1(e.target.value);
  };
  const ingredientWeight1 = (e: { target: { value: any } }) => {
    setIsIngredientWeight1(e.target.value);
  };

  const ingredientsDelete1 = (index: number) => {
    const ingredients = [...isIngredients1];
    ingredients.splice(index, 1);
    setIsIngredients1(ingredients);
  };

  const recipeIngredients2 = () => {
    const data = [
      ...isIngredients2,
      isIngredientName2 + " " + isIngredientWeight2,
    ];
    setIsIngredients2(data);
    setIsIngredientName2("");
    setIsIngredientWeight2("");
  };
  const ingredientName2 = (e: { target: { value: any } }) => {
    setIsIngredientName2(e.target.value);
  };
  const ingredientWeight2 = (e: { target: { value: any } }) => {
    setIsIngredientWeight2(e.target.value);
  };

  const ingredientsDelete2 = (index: number) => {
    const ingredients = [...isIngredients1];
    ingredients.splice(index, 1);
    setIsIngredients1(ingredients);
  };

  const stepPosting = () => {
    const data = [...isSteps, ""];
    setIsSteps(data);
  };

  const recipePosting = (e: { target: { value: any } }, index: number) => {
    const data = [...isSteps];
    data[index] = e.target.value;
    setIsSteps(data);
  };

  const ingredientsBtn = () => {
    setIsIngredients(!isIngredients);
    if (isIngredients == true) {
      setIsIngredients2([]);
    }
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    // Use FileReader to read the contents of the file
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setIsImage(imageUrl);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const recipeCreate = () => {
    axios
      .post(
        "http://localhost:8080/recipe",
        {
          title: isTitle,
          ingredients: isIngredients1,
          ingredients2: isIngredients2,
          steps: isSteps,
          thumbnail: isImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log("에러 응답:", error.response);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(function (response) {
        setIsUser(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("에러 응답:", error.response);
      });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.posting__title}>
        <p>
          {!isOnTitle ? (
            <input
              type="text"
              value={isTitleValue}
              onChange={recipeTitleInput}
            />
          ) : (
            isTitle
          )}
          <button onClick={recipeTitle}>{!isOnTitle ? "저장" : "수정"}</button>
        </p>
        {isImage.length === 0 ? (
          <div className={styles.iconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faFileArrowUp} />
          </div>
        ) : (
          <Image src={isImage} alt="Uploaded Image" width={300} height={200} />
        )}

        <div>
          <span>
            <Image src={isUser.picture} alt="" width={50} height={50} />
            <p>{isUser.name}</p>
          </span>
          <button className={styles.posting__image} onClick={imageUpload}>
            <span className="icon">
              <FontAwesomeIcon icon={faFileArrowUp} />
            </span>
            <span className="explain">대표 이미지 업로드</span>
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className={styles.posting__ingredient}>
        <h1>
          <FontAwesomeIcon className={styles.icon} icon={faUtensils} />
          <span>재료</span>
        </h1>
        <div className={styles.posting__ingredient__list}>
          <div className={styles.posting__ingredient__item}>
            <div>
              <h2>[재료]</h2>
              {!isIngredients ? (
                <button onClick={ingredientsBtn}>부재료 추가</button>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                value={isIngredientName1}
                placeholder="재료 이름"
                onChange={ingredientName1}
              />
              <input
                type="text"
                value={isIngredientWeight1}
                placeholder="수량"
                onChange={ingredientWeight1}
              />
              <button onClick={recipeIngredients1}>재료추가</button>
            </div>
            {isIngredients1.map((ingredient, index) => {
              return ingredient.length > 0 ? (
                // eslint-disable-next-line react/jsx-key
                <div>
                  <li>
                    <ul>
                      <p>{ingredient}</p>
                    </ul>
                  </li>
                  <button
                    onClick={(e) => {
                      ingredientsDelete1(index);
                    }}
                  >
                    삭제
                  </button>
                </div>
              ) : null;
            })}
          </div>
          {!isIngredients ? null : (
            <div className={styles.posting__ingredient__item}>
              <div>
                <h2>[부재료]</h2>
                {!isIngredients ? null : (
                  <button onClick={ingredientsBtn}>부재료 제거</button>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={isIngredientName2}
                  placeholder="재료 이름"
                  onChange={ingredientName2}
                />
                <input
                  type="text"
                  value={isIngredientWeight2}
                  placeholder="수량"
                  onChange={ingredientWeight2}
                />
                <button onClick={recipeIngredients2}>재료추가</button>
              </div>
              {isIngredients2.map((ingredient, index) => {
                return ingredient.length > 0 ? (
                  // eslint-disable-next-line react/jsx-key
                  <div>
                    <li>
                      <ul>
                        <p>{ingredient}</p>
                      </ul>
                    </li>
                    <button
                      onClick={(e) => {
                        ingredientsDelete2(index);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        <a
          href="https://www.coupang.com/?src=1042016&spec=10304902&addtag=900&ctag=HOME&lptag=coupang&itime=20231204140029&pageType=HOME&pageValue=HOME&wPcid=9892391435437537413314&wRef=www.google.com&wTime=20231204140029&redirect=landing&gclid=Cj0KCQiA67CrBhC1ARIsACKAa8TLUkyT9NmUgR5ONzXVGSo7W-ARSn0iiO9POcmNw8RYwWLuFWdgV54aAqQJEALw_wcB&mcid=e656d6631f474ee8b126919624b93f01&network=g"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.mycart__button}>구매</button>
        </a>
      </div>

      <div className={styles.posting__ricipe}>
        <div className={styles.posting__ricipe__title}>
          <h1>
            <FontAwesomeIcon className={styles.icon} icon={faUtensils} />
            <span>조리순서</span>
          </h1>
          <button onClick={stepPosting}>추가</button>
        </div>
        {isSteps.map((step, index) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div className={styles.posting__ricipe__list}>
              <li>
                <ul>
                  <div>
                    <p>{index + 1}</p>
                  </div>
                  <input
                    type="textarea"
                    value={step}
                    className={styles.posting__ricipe__comment}
                    onChange={(e) => {
                      recipePosting(e, index);
                    }}
                  />
                </ul>
              </li>
            </div>
          );
        })}
        <button onClick={recipeCreate}>저장</button>
      </div>
    </main>
  );
}
