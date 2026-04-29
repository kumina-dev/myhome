package com.circl.app.security

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class CirclSecureStoreModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  private val preferences: SharedPreferences =
    reactContext.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

  override fun getName(): String = MODULE_NAME

  @ReactMethod
  fun load(key: String, promise: Promise) {
    try {
      val encrypted = preferences.getString("${key}_value", null)
      val iv = preferences.getString("${key}_iv", null)

      if (encrypted == null || iv == null) {
        promise.resolve(null)
        return
      }

      val cipher = Cipher.getInstance(TRANSFORMATION)
      cipher.init(
        Cipher.DECRYPT_MODE,
        getOrCreateSecretKey(),
        GCMParameterSpec(TAG_LENGTH_BITS, Base64.decode(iv, Base64.NO_WRAP))
      )

      val plainBytes = cipher.doFinal(Base64.decode(encrypted, Base64.NO_WRAP))
      promise.resolve(String(plainBytes, Charsets.UTF_8))
    } catch (caught: Exception) {
      promise.reject("CIRCL_SECURE_STORE_LOAD_FAILED", caught)
    }
  }

  @ReactMethod
  fun save(key: String, value: String, promise: Promise) {
    try {
      val cipher = Cipher.getInstance(TRANSFORMATION)
      cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())

      val encrypted = cipher.doFinal(value.toByteArray(Charsets.UTF_8))
      preferences
        .edit()
        .putString("${key}_value", Base64.encodeToString(encrypted, Base64.NO_WRAP))
        .putString("${key}_iv", Base64.encodeToString(cipher.iv, Base64.NO_WRAP))
        .apply()

      promise.resolve(null)
    } catch (caught: Exception) {
      promise.reject("CIRCL_SECURE_STORE_SAVE_FAILED", caught)
    }
  }

  @ReactMethod
  fun clear(key: String, promise: Promise) {
    try {
      preferences
        .edit()
        .remove("${key}_value")
        .remove("${key}_iv")
        .apply()

      promise.resolve(null)
    } catch (caught: Exception) {
      promise.reject("CIRCL_SECURE_STORE_CLEAR_FAILED", caught)
    }
  }

  private fun getOrCreateSecretKey(): SecretKey {
    val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply {
      load(null)
    }

    val existingKey = keyStore.getKey(KEY_ALIAS, null)

    if (existingKey is SecretKey) {
      return existingKey
    }

    val keyGenerator = KeyGenerator.getInstance(
      KeyProperties.KEY_ALGORITHM_AES,
      ANDROID_KEYSTORE
    )

    val keySpec = KeyGenParameterSpec.Builder(
      KEY_ALIAS,
      KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
    )
      .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
      .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
      .setRandomizedEncryptionRequired(true)
      .build()

    keyGenerator.init(keySpec)
    return keyGenerator.generateKey()
  }

  private companion object {
    const val MODULE_NAME = "CirclSecureStore"
    const val PREFERENCES_NAME = "circl_secure_store"
    const val ANDROID_KEYSTORE = "AndroidKeyStore"
    const val KEY_ALIAS = "circl_pocketbase_auth"
    const val TRANSFORMATION = "AES/GCM/NoPadding"
    const val TAG_LENGTH_BITS = 128
  }
}