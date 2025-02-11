import React from 'react';
import Image from 'next/image';
import styles from '../weather-news/index.module.scss';
import Link from 'next/link';

interface Weather {
  dt: number;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    main: string;
    icon: string;
  }[];
}

interface Props {
  weatherNews: {
    list: Weather[];
  };
}

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeatherNews: React.FC<Props> = ({ weatherNews }) => {
  if (!weatherNews || !weatherNews.list || weatherNews.list.length === 0) {
    return <div>No weather data available</div>;
  }

  const currentWeatherMain = weatherNews.list[0].weather[0].main;
  const currentWeatherTemp = weatherNews.list[0].main.temp;
  const currentWeatherIcon = weatherNews.list[0].weather[0].icon;

  const dailyWeather = weatherNews.list.filter((_, index) => index % 8 === 0);

  return (
    <section className={styles.weather}>
      <h1>Tokyo</h1>
      <div className={styles.weather__main}>
        <div className={styles.weather__top}>
          <div className={styles.weather__heading}>
            <a>{currentWeatherMain}</a>
            <p>
              {currentWeatherTemp.toFixed(1)}
              <span>˚c</span>
            </p>
          </div>
          <Image
            className={styles.weather__icon}
            src={`http://openweathermap.org/img/wn/${currentWeatherIcon}.png`}
            alt="Tokyo's weather icon"
            loading="eager"
            width={92}
            height={92}
            priority
          />
        </div>
        <div className={styles.weather__weekly}>
          <ul className={styles.weather__weekly__list}>
            {dailyWeather.slice(0, 5).map((date, index) => {
              const time = new Date(date.dt * 1000);
              let day = week[time.getDay()];
              const nowDay = week[new Date().getDay()];
              if (day === nowDay) {
                day = 'Today';
              }
              return (
                <li key={index}>
                  <p>{day}</p>
                  <span>
                    <Image
                      src={`http://openweathermap.org/img/wn/${date.weather[0].icon}.png`}
                      className={styles.weather__icon}
                      alt={`${day}'s weather icon`}
                      loading="eager"
                      width={61}
                      height={61}
                      priority
                    />
                  </span>
                  <div className={styles.weather__temp}>
                    <p className={styles.weather__temp__high}>
                      {Math.round(date.main.temp_max)}˚c
                    </p>
                    <p className={styles.weather__temp__low}>
                      {Math.round(date.main.temp_min)}˚c
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.weather__bottom}>
          <Link href="https://weathernews.jp/onebox/" legacyBehavior>
            <a target="_blank" rel="noopener">
              ウェザーニュース
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WeatherNews;
