
import SvgIcon from "@/icon/SvgIcon.vue";
import RequireContext = __WebpackModuleApi.RequireContext;

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext: RequireContext) => {
    return requireContext.keys().map(requireContext)
};
requireAll(req)
