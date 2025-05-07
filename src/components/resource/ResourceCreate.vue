<template>
  <a-form :model="form" ref="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
    <!-- 添加资源导航 -->
    <a-form-item :label="$t('common.resourceName')" name="resourceName">
      <a-input
        v-model:value="form.resourceName"
               :placeholder="$t('common.pleaseResource')"/>
    </a-form-item>
    <a-form-item :label="$t('common.resourceCategory')" name="category">
      <a-input
        v-model:value="form.category"
               :placeholder="$t('common.pleaseCategory')"/>
    </a-form-item>
    <a-form-item :label="$t('common.resourceDesc')" name="desc">
      <a-input
        v-model:value="form.desc"
               :placeholder="$t('common.pleaseDesc')"/>
    </a-form-item>
    <a-form-item :label="$t('common.resourceLink')" name="link">
      <a-input
        v-model:value="form.link"
               :placeholder="$t('common.pleaseLink')"/>
    </a-form-item>
    <!-- 资源封面 -->
    <a-form-item :label="$t('common.resourceLogo')" style="height:120px">
      <ImageUpload
          ref="child"
          :resourceLogo="resourceLogo"
          @resourceLogoFn="resourceLogoFn"/>
    </a-form-item>
    <a-divider style="margin: 10px 0;"></a-divider>
    <a-form-item class="form-item-submit">
      <a-button type="primary" html-type="submit" @click="handleSubmit" >{{ $t('common.sureAndAdd') }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import resourceService from "@/service/resourceService";
import ImageUpload from "@/components/resource/ImageUpload";

export default {
  components: {ImageUpload},

  props: {
    // 资源导航id
    resourceId: {type: Number, default: 0},
    // 资源导航名称
    resourceName: {type: String, default: ''},
    // 资源导航名称
    category: {type: String, default: ''},
    // 资源导航名称
    desc: {type: String, default: ''},
    // 资源导航名称
    link: {type: String, default: ''},
    // 资源导航logo
    resourceLogoInit: {type: String, default: null},
  },

  data() {
    return {
      // 资源导航logo
      resourceLogo: this.resourceLogoInit,
      form: {},
      // 表单验证
      // validatorRules: {
      //   resourceName: {
      //     // 检验规则
      //     rules: [
      //       // 是否必须填写
      //       {required: true, message: this.$t('common.pleaseResource')}
      //     ]
      //   },
      //   resourceCategory: {
      //     // 检验规则
      //     rules: [
      //       // 是否必须填写
      //       {required: true, message: this.$t('common.resourceCategory')}
      //     ]
      //   },
      //   resourceDesc: {
      //     // 检验规则
      //     rules: [
      //       // 是否必须填写
      //       {required: true, message: this.$t('common.resourceDesc')}
      //     ]
      //   },
      //   resourceLink: {
      //     // 检验规则
      //     rules: [
      //       // 是否必须填写
      //       {required: true, message: this.$t('common.resourceLink')}
      //     ]
      //   },
      // },
      rules: {
        resourceName: [{required: true, message: this.$t('common.pleaseResource')}],
        resourceCategory: [{required: true, message: this.$t('common.resourceCategory')}],
        resourceDesc: [{required: true, message: this.$t('common.resourceDesc')}],
        resourceLink: [{required: true, message: this.$t('common.resourceLink')}],
      },
    }
  },

  methods: {
    // handleSubmit(e) {
    //   e.preventDefault();
    //
    //   this.$refs.form.validateFields().then((values) => {
    //     // if (!err) {
    //       const data = {
    //         "logo": this.resourceLogo,
    //         "resourceName": this.form.resourceName,
    //         "category": this.form.category,
    //         "desc": this.form.desc,
    //         "link": this.form.link,
    //       };
    //       if (this.resourceLogo) {
    //         // 更新
    //         if (this.resourceId) {
    //           data.id = this.resourceId;
    //           this.resourceUpdate(data);
    //           // 新增
    //         } else {
    //           this.resourceCreate(data);
    //         }
    //       } else {
    //         this.$message.warning('请上传资源导航Logo');
    //       }
    //
    //     // }
    //   });
    // },
    handleSubmit(e) {
      e.preventDefault();
      setTimeout(() => {
        this.$refs.form
          .validateFields()
          .then(async (values) => {
            // 2. 构建提交数据
            const data = {
              logo: this.resourceLogo,
              resourceName: this.form.resourceName,
              category: this.form.category,
              desc: this.form.desc,
              link: this.form.link,
            };

            // 3. 必填项检查（Logo）
            if (!this.resourceLogo) {
              this.$message.warning("请上传资源导航Logo");
              return;
            }

            try {
              // 4. 根据资源ID判断操作类型（添加错误边界）
              if (this.resourceId) {
                await this.resourceUpdate(data)
              }
              else {
                await this.resourceCreate(data)
              }

              // 5. 提交成功处理
              this.$message.success(this.resourceId ? "更新成功" : "创建成功");
              this.$refs.form.resetFields(); // 重置表单
              this.$emit("refresh"); // 通知父组件刷新列表
            } catch (apiError) {
              // 6. 处理 API 错误
              console.error("接口错误:", apiError);
              this.$message.error(apiError.message);

              // 7. 处理数据版本冲突（outOfDate）
              if (apiError.response?.data?.outOfDate) {
                this.$confirm("数据已过期，请重新提交", "提示", {
                  confirmButtonText: "确定",
                });
              }
            }
          })
          .catch((validationErrors) => {
            // 8. 处理表单校验错误
            console.error("校验失败:", validationErrors);
            this.$refs.form.setFields(validationErrors); // 高亮错误字段
          });

      }, 0);
      // 1. 表单验证（捕获校验错误）
    },
    // 新增资源导航
    resourceCreate(data) {
      resourceService.resourceCreate(data)
          .then(res => {
            // 清空表单
            this.$refs.form.resetFields();
            // 清空logo
            this.$refs.child.clearFileList();
            // 隐藏气泡框
            this.$emit("hideResourceVisibleFn");
            this.refresh();
          })
          .catch(err => {
            this.$message.error(err.desc);
          });
    },

    // 更新资源导航
    resourceUpdate(data) {
      resourceService.resourceUpdate(data)
          .then(res => {
            this.$emit("hideResourceVisibleFn", data.id);
            this.refresh();
          })
          .catch(err => {
            this.$message.error(err.desc);
          });
    },

    resourceLogoFn(logo) {
      this.resourceLogo = logo;
    },

    refresh() {
      this.$emit("refresh");
    },
  },

  mounted() {
    // v-mode和v-decorator冲突问题解决方案
    this.form = {
      resourceName: this.resourceName,
      category: this.category,
      desc: this.desc,
      link: this.link,
    }
  }

}
</script>

<style scoped>
/* 提交按钮样式 */
.form-item-submit {
  display: flex;
  text-align: right;
  justify-content: right;
  margin-bottom: 0;
}
</style>
