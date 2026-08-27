// import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Image,
//   Pressable,
//   Switch,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
//
// import {STUDENT, VARIANT, FLASH_SECONDS, BANNER_IMAGE_ID, examStamp} from '@constants/student';
// import {COLORS, SIZES} from '@constants/theme';
// import {useTheme} from '@contexts/ThemeContext';
// import {useCountdown} from '@hooks/useCountdown';
// import {fetchProducts, Product, CategoryId} from '@services/productApi';
// import Typography from '@components/ui/Typography';
// import ShopInput from '@components/ui/ShopInput';
// import ShopButton from '@components/ui/ShopButton';
//
// type State = {qty: number};
// type Action = {type: 'ADD'} | {type: 'REMOVE'} | {type: 'RESET'};
//
// const qtyReducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case 'ADD':
//       return {qty: state.qty + 1};
//     case 'REMOVE':
//       return {qty: Math.max(1, state.qty - 1)};
//     case 'RESET':
//       return {qty: 1};
//     default:
//       return state;
//   }
// };
//
// const CATEGORIES: {id: CategoryId; label: string}[] = [
//   {id: 'all', label: 'Tất cả'},
//   {id: 'food', label: 'Đồ ăn'},
//   {id: 'drink', label: 'Nước'},
//   {id: 'study', label: 'Học tập'},
// ];
//
// const HomeScreen = () => {
//   const {theme, mode, toggleTheme} = useTheme();
//   const {seconds, formattedTime} = useCountdown(FLASH_SECONDS);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [state, dispatch] = useReducer(qtyReducer, {qty: 1});
//
//   const stamp = useMemo(() => examStamp(), []);
//
//   const loadProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await fetchProducts();
//       setProducts(data);
//     } catch (err) {
//       setError('Đã có lỗi xảy ra khi tải dữ liệu');
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);
//
//   const filteredProducts = products.filter(p => {
//     const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
//     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });
//
//   const categories = VARIANT.chipsReversed ? [...CATEGORIES].reverse() : CATEGORIES;
//
//   const handleOrder = (product: Product) => {
//     setSelectedProduct(product);
//     dispatch({type: 'RESET'});
//     setModalVisible(true);
//   };
//
//   const confirmOrder = () => {
//     if (!selectedProduct) return;
//
//     Alert.alert(
//       `CampusMart · ${STUDENT.mssv}`,
//       `${STUDENT.hoTen} (#${stamp}) đã ghi nhận: ${selectedProduct.name} x ${state.qty}`,
//       [{text: 'OK', onPress: () => {
//         setModalVisible(false);
//         dispatch({type: 'RESET'});
//       }}]
//     );
//   };
//
//   const renderProduct = ({item}: {item: Product}) => (
//     <Pressable style={[styles.productCard, {backgroundColor: theme.surface, borderColor: theme.border}]} onPress={() => handleOrder(item)}>
//       <Image source={{uri: item.image}} style={styles.productImage} resizeMode="contain" />
//       <View style={styles.productInfo}>
//         <Typography variant="bodyBold" numberOfLines={1} color={theme.text}>
//           {item.name}
//         </Typography>
//         <Typography variant="caption" color={theme.textLight}>
//           {CATEGORIES.find(c => c.id === item.category)?.label}
//         </Typography>
//         <Typography variant="subtitle" color={COLORS.primary} style={styles.price}>
//           {item.price.toLocaleString('vi-VN')} đ
//         </Typography>
//         <ShopButton
//           title="Đặt"
//           onPress={() => handleOrder(item)}
//           style={styles.buyButton}
//         />
//       </View>
//     </Pressable>
//   );
//
//   const Watermark = () => (
//     <View style={styles.watermark}>
//       <Typography variant="caption" color={theme.textLight}>
//         TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
//       </Typography>
//     </View>
//   );
//
//   return (
//     <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
//       {VARIANT.watermarkAtTop && <Watermark />}
//
//       <View style={styles.header}>
//         <Typography variant="title" color={COLORS.primary}>
//           CAMPUSMART
//         </Typography>
//         <View style={styles.headerRight}>
//           {VARIANT.themeControl === 'switch' ? (
//             <Switch
//               value={mode === 'dark'}
//               onValueChange={toggleTheme}
//               thumbColor={COLORS.primary}
//               trackColor={{false: COLORS.border, true: COLORS.primary}}
//             />
//           ) : (
//             <Pressable onPress={toggleTheme} style={styles.themeBtn}>
//               <Typography variant="caption" color={COLORS.primary}>
//                 {mode === 'light' ? 'DARK' : 'LIGHT'}
//               </Typography>
//             </Pressable>
//           )}
//         </View>
//       </View>
//
//       <FlatList
//         data={filteredProducts}
//         keyExtractor={item => item.id.toString()}
//         renderItem={renderProduct}
//         numColumns={2}
//         contentContainerStyle={styles.listContent}
//         columnWrapperStyle={styles.columnWrapper}
//         ListHeaderComponent={
//           <View style={styles.listHeader}>
//             <View style={styles.flashSaleRow}>
//               <Typography variant="subtitle" color={theme.text}>
//                 Cửa hàng tiện lợi KTX
//               </Typography>
//               <View style={[styles.countdownBadge, {backgroundColor: COLORS.secondary}]}>
//                 <Typography variant="caption" color={COLORS.surface}>
//                   Flash sale: {formattedTime}
//                 </Typography>
//               </View>
//             </View>
//
//             <View style={styles.searchInput}>
//               <ShopInput
//                 placeholder={`MSSV: ${STUDENT.mssv}`}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>
//
//             <Image
//               source={{uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320`}}
//               style={styles.banner}
//             />
//
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
//               {categories.map(cat => (
//                 <Pressable
//                   key={cat.id}
//                   style={[
//                     styles.chip,
//                     {backgroundColor: theme.surface, borderColor: theme.border},
//                     selectedCategory === cat.id && {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
//                   ]}
//                   onPress={() => setSelectedCategory(cat.id)}>
//                   <Typography
//                     variant="caption"
//                     color={selectedCategory === cat.id ? COLORS.surface : theme.text}>
//                     {cat.label}
//                   </Typography>
//                 </Pressable>
//               ))}
//             </ScrollView>
//           </View>
//         }
//         ListEmptyComponent={
//           loading ? (
//             <ActivityIndicator size="large" color={COLORS.primary} style={styles.center} />
//           ) : error ? (
//             <View style={styles.center}>
//               <Typography color={COLORS.error}>{error}</Typography>
//               <ShopButton title="Thử lại" onPress={loadProducts} variant="outline" style={{marginTop: SIZES.md}} />
//             </View>
//           ) : (
//             <View style={styles.center}>
//               <Typography color={theme.textLight}>Không tìm thấy sản phẩm nào</Typography>
//             </View>
//           )
//         }
//       />
//
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType={VARIANT.modalAnimation}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, {backgroundColor: theme.surface}]}>
//             {selectedProduct && (
//               <>
//                 <Image source={{uri: selectedProduct.image}} style={styles.modalImage} resizeMode="contain" />
//                 <Typography variant="title" style={styles.modalTitle} color={theme.text}>
//                   {selectedProduct.name}
//                 </Typography>
//                 <Typography variant="caption" color={theme.textLight}>
//                   {CATEGORIES.find(c => c.id === selectedProduct.category)?.label}
//                 </Typography>
//                 <Typography variant="subtitle" color={COLORS.primary} style={styles.modalPrice}>
//                   {selectedProduct.price.toLocaleString('vi-VN')} đ
//                 </Typography>
//                 <Typography variant="body" numberOfLines={2} style={styles.modalDesc} color={theme.textLight}>
//                   {selectedProduct.description}
//                 </Typography>
//
//                 <View style={styles.qtyRow}>
//                   <Pressable style={styles.qtyBtn} onPress={() => dispatch({type: 'REMOVE'})}>
//                     <Typography variant="title" color={COLORS.primary}>-</Typography>
//                   </Pressable>
//                   <Typography variant="subtitle" style={styles.qtyText} color={theme.text}>
//                     {state.qty}
//                   </Typography>
//                   <Pressable style={styles.qtyBtn} onPress={() => dispatch({type: 'ADD'})}>
//                     <Typography variant="title" color={COLORS.primary}>+</Typography>
//                   </Pressable>
//                 </View>
//
//                 <ShopButton
//                   title={seconds > 0 ? 'Xác nhận' : 'Hết giờ flash-sale'}
//                   disabled={seconds <= 0}
//                   onPress={confirmOrder}
//                   style={styles.confirmBtn}
//                 />
//                 <ShopButton
//                   title="Hủy"
//                   variant="outline"
//                   onPress={() => setModalVisible(false)}
//                   style={styles.cancelBtn}
//                 />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//
//       {!VARIANT.watermarkAtTop && <Watermark />}
//     </SafeAreaView>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   watermark: {
//     alignItems: 'center',
//     padding: SIZES.xs,
//     opacity: 0.6,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SIZES.lg,
//     paddingVertical: SIZES.md,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   themeBtn: {
//     padding: SIZES.sm,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: SIZES.radiusSm,
//   },
//   listContent: {
//     paddingBottom: SIZES.xxl,
//   },
//   listHeader: {
//     paddingHorizontal: SIZES.lg,
//   },
//   flashSaleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: SIZES.md,
//   },
//   countdownBadge: {
//     paddingHorizontal: SIZES.sm,
//     paddingVertical: SIZES.xs,
//     borderRadius: SIZES.radiusSm,
//   },
//   searchInput: {
//     marginBottom: SIZES.md,
//   },
//   banner: {
//     width: '100%',
//     height: 160,
//     borderRadius: SIZES.radiusMd,
//     marginBottom: SIZES.md,
//   },
//   chipScroll: {
//     flexDirection: 'row',
//     marginBottom: SIZES.lg,
//   },
//   chip: {
//     paddingHorizontal: SIZES.md,
//     paddingVertical: SIZES.xs,
//     borderRadius: SIZES.radiusLg,
//     borderWidth: 1,
//     marginRight: SIZES.sm,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     paddingHorizontal: SIZES.lg,
//   },
//   productCard: {
//     width: '48%',
//     borderRadius: SIZES.radiusMd,
//     borderWidth: 1,
//     padding: SIZES.sm,
//     marginBottom: SIZES.md,
//   },
//   productImage: {
//     width: '100%',
//     height: 120,
//     marginBottom: SIZES.sm,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   price: {
//     marginVertical: SIZES.xs,
//   },
//   buyButton: {
//     minHeight: 32,
//     height: 32,
//   },
//   center: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: SIZES.xxl,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '85%',
//     padding: SIZES.xl,
//     borderRadius: SIZES.radiusLg,
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: 200,
//     height: 200,
//     marginBottom: SIZES.md,
//   },
//   modalTitle: {
//     textAlign: 'center',
//   },
//   modalPrice: {
//     marginVertical: SIZES.sm,
//   },
//   modalDesc: {
//     textAlign: 'center',
//     marginBottom: SIZES.lg,
//   },
//   qtyRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: SIZES.xl,
//   },
//   qtyBtn: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 20,
//   },
//   qtyText: {
//     marginHorizontal: SIZES.xl,
//     width: 20,
//     textAlign: 'center',
//   },
//   confirmBtn: {
//     width: '100%',
//     marginBottom: SIZES.sm,
//   },
//   cancelBtn: {
//     width: '100%',
//   },
// });
//
// export default HomeScreen;
//=============================================================================
import React, {
  useReducer,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  STUDENT,
  VARIANT,
  FLASH_SECONDS,
  BANNER_IMAGE_ID,
  examStamp,
} from '@constants/student';

import {COLORS, SIZES} from '@constants/theme';
import {useTheme} from '@contexts/ThemeContext';
import {useCountdown} from '@hooks/useCountdown';
import {fetchProducts, Product, CategoryId} from '@services/productApi';

import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ui/ShopButton';

type State = {
  qty: number;
};

type Action =
  | {type: 'ADD'}
  | {type: 'REMOVE'}
  | {type: 'RESET'};

const qtyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD':
      return {
        qty: state.qty + 1,
      };

    case 'REMOVE':
      return {
        qty: Math.max(1, state.qty - 1),
      };

    case 'RESET':
      return {
        qty: 1,
      };

    default:
      return state;
  }
};

const CATEGORIES: {id: CategoryId; label: string}[] = [
  {id: 'all', label: 'Tất cả'},
  {id: 'food', label: 'Đồ ăn'},
  {id: 'drink', label: 'Nước'},
  {id: 'study', label: 'Học tập'},
];

const HomeScreen = () => {
  // ============================================================
  // THEME
  // ============================================================
  const {theme, mode, toggleTheme} = useTheme();

  // ============================================================
  // COUNTDOWN
  // ============================================================
  const {seconds, formattedTime} = useCountdown(FLASH_SECONDS);

  // ============================================================
  // PRODUCTS
  // ============================================================
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // FILTER
  // ============================================================
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>('all');

  const [searchQuery, setSearchQuery] = useState('');

  // ============================================================
  // MODAL
  // ============================================================
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  // ============================================================
  // QUANTITY REDUCER
  // ============================================================
  const [state, dispatch] = useReducer(qtyReducer, {
    qty: 1,
  });

  // ============================================================
  // EXAM STAMP
  // ============================================================
  const stamp = useMemo(() => examStamp(), []);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchProducts();

      setProducts(data);
    } catch (err) {
      setError('Đã có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ============================================================
  // FILTER PRODUCTS
  // ============================================================
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const categories = VARIANT.chipsReversed
    ? [...CATEGORIES].reverse()
    : CATEGORIES;

  // ============================================================
  // OPEN ORDER MODAL
  // ============================================================
  const handleOrder = (product: Product) => {
    setSelectedProduct(product);

    // Mỗi lần mở sản phẩm mới đều bắt đầu từ 1
    dispatch({
      type: 'RESET',
    });

    setModalVisible(true);
  };

  // ============================================================
  // CLOSE MODAL
  // Không Alert
  // Reset quantity
  // ============================================================
  const closeModal = () => {
    setModalVisible(false);

    dispatch({
      type: 'RESET',
    });
  };

  // ============================================================
  // CONFIRM ORDER
  // ============================================================
  const confirmOrder = () => {
    if (!selectedProduct) {
      return;
    }

    // Flash sale hết giờ thì không cho xác nhận
    if (seconds <= 0) {
      return;
    }

    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${stamp}) đã ghi nhận: ${selectedProduct.name} x ${state.qty}`,
      [
        {
          text: 'OK',
          onPress: () => {
            closeModal();
          },
        },
      ],
    );
  };

  // ============================================================
  // WATERMARK
  // ============================================================
  const Watermark = () => {
    return (
      <View style={styles.watermark}>
        <Typography
          variant="caption"
          color={theme.text}>
          TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
        </Typography>
      </View>
    );
  };

  // ============================================================
  // PRODUCT ITEM
  // ============================================================
  const renderProduct = ({item}: {item: Product}) => {
    const categoryLabel =
      CATEGORIES.find(
        category => category.id === item.category,
      )?.label;

    return (
      <View
        style={[
          styles.productCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}>

        <Pressable
          onPress={() => handleOrder(item)}
          style={styles.productPressable}>

          <Image
            source={{uri: item.image}}
            style={styles.productImage}
            resizeMode="contain"
          />

          <View style={styles.productInfo}>

            <Typography
              variant="bodyBold"
              numberOfLines={1}
              color={theme.text}>
              {item.name}
            </Typography>

            <Typography
              variant="caption"
              color={theme.textLight}>
              {categoryLabel}
            </Typography>

            <Typography
              variant="subtitle"
              color={COLORS.primary}
              style={styles.price}>
              {item.price.toLocaleString('vi-VN')} đ
            </Typography>

          </View>
        </Pressable>

        <ShopButton
          title="Đặt"
          onPress={() => handleOrder(item)}
          style={styles.buyButton}
        />

      </View>
    );
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}>

      {/* ======================================================
          WATERMARK
      ====================================================== */}
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* ======================================================
          HEADER
      ====================================================== */}
      <View style={styles.header}>

        <Typography
          variant="title"
          color={theme.text}>
          CAMPUSMART
        </Typography>

        {/* ====================================================
            THEME BUTTON
        ==================================================== */}
        <Pressable
          onPress={toggleTheme}
          android_ripple={{
            color: theme.border,
          }}
          style={({pressed}) => [
            styles.themeBtn,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}>

          <Typography
            variant="caption"
            color={theme.text}>
            {mode === 'light' ? '🌙 TỐI' : '☀️ SÁNG'}
          </Typography>

        </Pressable>

      </View>

      {/* ======================================================
          PRODUCT LIST
      ====================================================== */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}

        ListHeaderComponent={
          <View style={styles.listHeader}>

            {/* FLASH SALE */}
            <View style={styles.flashSaleRow}>

              <Typography
                variant="subtitle"
                color={theme.text}>
                Cửa hàng tiện lợi KTX
              </Typography>

              <View
                style={[
                  styles.countdownBadge,
                  {
                    backgroundColor: COLORS.secondary,
                  },
                ]}>

                <Typography
                  variant="caption"
                  color={COLORS.surface}>
                  Flash sale: {formattedTime}
                </Typography>

              </View>

            </View>

            {/* SEARCH */}
            <View style={styles.searchInput}>

              <ShopInput
                placeholder={`MSSV: ${STUDENT.mssv}`}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

            </View>

            {/* BANNER */}
            <Image
              source={{
                uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320`,
              }}
              style={styles.banner}
            />

            {/* CATEGORY */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}>

              {categories.map(category => {

                const selected =
                  selectedCategory === category.id;

                return (
                  <Pressable
                    key={category.id}
                    onPress={() =>
                      setSelectedCategory(category.id)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected
                          ? COLORS.primary
                          : theme.surface,

                        borderColor: selected
                          ? COLORS.primary
                          : theme.border,
                      },
                    ]}>

                    <Typography
                      variant="caption"
                      color={
                        selected
                          ? COLORS.surface
                          : theme.text
                      }>
                      {category.label}
                    </Typography>

                  </Pressable>
                );
              })}

            </ScrollView>
          </View>
        }

        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.center}
            />
          ) : error ? (
            <View style={styles.center}>

              <Typography
                color={COLORS.error}>
                {error}
              </Typography>

              <ShopButton
                title="Thử lại"
                onPress={loadProducts}
                variant="outline"
                style={{
                  marginTop: SIZES.md,
                }}
              />

            </View>
          ) : (
            <View style={styles.center}>

              <Typography
                color={theme.textLight}>
                Không tìm thấy sản phẩm nào
              </Typography>

            </View>
          )
        }
      />

      {/* ======================================================
          ORDER MODAL
      ====================================================== */}
      <Modal
        visible={modalVisible}
        transparent
        animationType={VARIANT.modalAnimation}
        onRequestClose={closeModal}>

        <View style={styles.modalOverlay}>

          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
              },
            ]}>

            {selectedProduct && (
              <>

                {/* IMAGE */}
                <Image
                  source={{
                    uri: selectedProduct.image,
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />

                {/* NAME */}
                <Typography
                  variant="title"
                  style={styles.modalTitle}
                  color={theme.text}>
                  {selectedProduct.name}
                </Typography>

                {/* CATEGORY */}
                <Typography
                  variant="caption"
                  color={theme.textLight}>
                  {
                    CATEGORIES.find(
                      category =>
                        category.id ===
                        selectedProduct.category,
                    )?.label
                  }
                </Typography>

                {/* PRICE */}
                <Typography
                  variant="subtitle"
                  color={COLORS.primary}
                  style={styles.modalPrice}>
                  {selectedProduct.price.toLocaleString('vi-VN')} đ
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  variant="body"
                  numberOfLines={2}
                  style={styles.modalDesc}
                  color={theme.textLight}>
                  {selectedProduct.description}
                </Typography>

                {/* QUANTITY */}
                <View style={styles.qtyRow}>

                  {/* MINUS */}
                  <Pressable
                    onPress={() =>
                      dispatch({
                        type: 'REMOVE',
                      })
                    }
                    style={[
                      styles.qtyBtn,
                      {
                        backgroundColor: theme.surface,
                        borderColor: COLORS.primary,
                      },
                    ]}>

                    <Typography
                      variant="title"
                      color={COLORS.primary}>
                      -
                    </Typography>

                  </Pressable>

                  {/* QUANTITY */}
                  <Typography
                    variant="subtitle"
                    style={styles.qtyText}
                    color={theme.text}>
                    {state.qty}
                  </Typography>

                  {/* PLUS */}
                  <Pressable
                    onPress={() =>
                      dispatch({
                        type: 'ADD',
                      })
                    }
                    style={[
                      styles.qtyBtn,
                      {
                        backgroundColor: theme.surface,
                        borderColor: COLORS.primary,
                      },
                    ]}>

                    <Typography
                      variant="title"
                      color={COLORS.primary}>
                      +
                    </Typography>

                  </Pressable>

                </View>

                {/* CONFIRM */}
                <ShopButton
                  title={
                    seconds > 0
                      ? 'Xác nhận'
                      : 'Hết giờ flash-sale'
                  }
                  disabled={seconds <= 0}
                  onPress={confirmOrder}
                  style={styles.confirmBtn}
                />

                {/* CANCEL */}
                <ShopButton
                  title="Hủy"
                  variant="outline"
                  onPress={closeModal}
                  style={styles.cancelBtn}
                />

              </>
            )}

          </View>
        </View>
      </Modal>

      {/* ======================================================
          BOTTOM WATERMARK
      ====================================================== */}
      {!VARIANT.watermarkAtTop && <Watermark />}

    </SafeAreaView>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  // ==========================================================
  // WATERMARK
  // ==========================================================

  watermark: {
    alignItems: 'center',
    padding: SIZES.xs,
    opacity: 0.6,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },

  // ==========================================================
  // THEME BUTTON
  // ==========================================================

  themeBtn: {
    minWidth: 85,
    minHeight: 40,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================================
  // LIST
  // ==========================================================

  listContent: {
    paddingBottom: SIZES.xxl,
  },

  listHeader: {
    paddingHorizontal: SIZES.lg,
  },

  // ==========================================================
  // FLASH SALE
  // ==========================================================

  flashSaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },

  countdownBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },

  // ==========================================================
  // SEARCH
  // ==========================================================

  searchInput: {
    marginBottom: SIZES.md,
  },

  // ==========================================================
  // BANNER
  // ==========================================================

  banner: {
    width: '100%',
    height: 160,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.md,
  },

  // ==========================================================
  // CATEGORY
  // ==========================================================

  chipScroll: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
  },

  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    marginRight: SIZES.sm,
  },

  // ==========================================================
  // PRODUCT
  // ==========================================================

  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
  },

  productCard: {
    width: '48%',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    padding: SIZES.sm,
    marginBottom: SIZES.md,
  },

  productPressable: {
    flex: 1,
  },

  productImage: {
    width: '100%',
    height: 120,
    marginBottom: SIZES.sm,
  },

  productInfo: {
    flex: 1,
  },

  price: {
    marginVertical: SIZES.xs,
  },

  buyButton: {
    minHeight: 32,
    height: 32,
    marginTop: SIZES.sm,
  },

  // ==========================================================
  // EMPTY / LOADING
  // ==========================================================

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZES.xxl,
  },

  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
  },

  modalImage: {
    width: 200,
    height: 200,
    marginBottom: SIZES.md,
  },

  modalTitle: {
    textAlign: 'center',
  },

  modalPrice: {
    marginVertical: SIZES.sm,
  },

  modalDesc: {
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },

  // ==========================================================
  // QUANTITY
  // ==========================================================

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },

  qtyBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },

  qtyText: {
    marginHorizontal: SIZES.xl,
    width: 20,
    textAlign: 'center',
  },

  // ==========================================================
  // BUTTONS
  // ==========================================================

  confirmBtn: {
    width: '100%',
    marginBottom: SIZES.sm,
  },

  cancelBtn: {
    width: '100%',
  },
});

export default HomeScreen;