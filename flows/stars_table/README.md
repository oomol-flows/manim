中国星标与对应 HIP
https://zhuanlan.zhihu.com/p/557993676

现代星表
https://www.astronexus.com/hyg

### 星表坐标

恒星的坐标 \( x0 \)、\( y0 \)、\( z0 \) 是以卡迪斯坐标系（Cartesian coordinates）表示的，它们提供了一种将恒星在三维空间中的位置以直角坐标的形式表达的方法。这些坐标的方向定义如下：

- \( x \) 轴指向赤经（Right Ascension, RA）0小时，赤纬（Declination, Dec）0度的方向。
- \( y \) 轴指向赤经6小时，赤纬0度的方向。
- \( z \) 轴指向赤纬90度的方向。

这些坐标的单位是秒差距（parsecs），秒差距是一种天文学中常用的距离单位，用于测量恒星距离。1秒差距大约等于3.262光年。

### 参数详情

1. `tyc`: The Tycho-2 ID, with leading zeros removed from the first and second portion (for consistency with Gaia linking tables).
   - 泰乔-2星表的编号，去掉了前两位的前导零。

2. `gaia`: The Gaia Data Release 3 ID.
   - 盖亚数据发布3的编号。

3. `hyg`: The HYG main catalog ID from HYG v3.
   - HYG主星表的编号，来源于HYG v3版本。

4. `hip`: The HIPPARCOS ID, from HYG if known, otherwise Tycho-2.
   - 依巴谷星表的编号，如果已知则来自HYG，否则来自泰乔-2。

5. `hd`: The Henry Draper (HD) catalog ID, from HYG if known, otherwise Tycho-2.
   - 亨利·德雷珀星表的编号，如果已知则来自HYG，否则来自泰乔-2。

6. `hr`: The Harvard / Yale Bright Star Catalog ID, from HYG.
   - 哈佛/耶鲁亮星星表的编号，来自HYG。

7. `gl`: The Gliese ID, from HYG.
   - 格利泽星表的编号，来自HYG。

8. `bayer`: The Bayer (Greek letter) designation, from HYG.
   - 拜耳命名法（希腊字母）的名称，来自HYG。

9. `flam`: The Flamsteed number, from HYG.
   - 弗拉姆斯蒂德编号，来自HYG。

10. `con`: The three-letter constellation abbreviation.
    - 三个字母的星座缩写。

11. `proper`: A proper name for the star, from HYG.
    - 恒星的专有名称，来自HYG。

12. `ra`: Right ascension (epoch + equinox 2000.0), in hours, from HYG or TYC.
    - 右天球经（参考历元2000.0），以小时为单位，来自HYG或泰乔-2。

13. `dec`: Declination (epoch + equinox 2000.0), in degrees, from HYG or TYC.
    - 右天球纬度（参考历元2000.0），以度为单位，来自HYG或泰乔-2。

14. `pos_src`: Indicator of source for the position fields ra and dec.
    - 位置字段ra和dec的数据来源指示。

15. `dist`: Distance from Sol in parsecs. From Gaia if known, otherwise HYG.
    - 距离太阳的距离，以秒差距为单位。如果已知则来自盖亚，否则来自HYG。

16. `x0, y0, z0`: These three fields are Cartesian coordinates.
    - 这三个字段是笛卡尔坐标。

17. `dist_src`: Indicator of source for the distance fields dist, x0, y0, z0.
    - 距离字段dist, x0, y0, z0的数据来源指示。

18. `mag`: V or VT magnitude for the star.
    - 恒星的V或VT视星等。

19. `absmag`: Corresponding absolute magnitude.
    - 对应的绝对星等。

20. `ci`: The color index, either B - V magnitude for the HYG sources (HIPPARCOS, Yale, Gliese) or BT - VT magnitude for Tycho-2.
    - 色指数，对于HYG源（依巴谷、耶鲁、格利泽）是B - V星等，对于泰乔-2是BT - VT星等。

21. `mag_src`: Indicator of source for the magnitude field mag.
    - 星等字段mag的数据来源指示。

22. `rv`: The radial velocity, in km/sec.
    - 径向速度，以千米每秒为单位。

23. `rv_src`: Indicator of source for the radial velocity field.
    - 径向速度字段的数据来源指示。

24. `pm_ra`: The proper motion in right ascension, in milliarcseconds per year.
    - 右天球经的自行，以毫角秒每年为单位。

25. `pm_dec`: The proper motion in declination, in milliarcseconds per year.
    - 右天球纬度的自行，以毫角秒每年为单位。

26. `pm_src`: Indicator of source for the proper motion fields.
    - 自行字段的数据来源指示。

27. `vx, vy, vz`: These three fields are Cartesian velocities, all in km/sec.
    - 这三个字段是笛卡尔速度，单位都是千米每秒。

28. `spect`: The MK spectral type, when known.
    - 已知时的MK光谱类型。

29. `spect_src`: Indicator of source for the spectral type field.
    - 光谱类型字段的数据来源指示。

这些列包含了恒星的各种信息，从它们的星表编号、名称、位置、自行、距离、视星等、绝对星等、色指数、径向速度、光谱类型到它们的笛卡尔坐标和速度等。这些数据对于天文学家和天文爱好者来说都是非常重要的信息。